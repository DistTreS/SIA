const DEFAULT_OPTIONS = {
  ga: {
    populationSize: 24,
    generations: 40,
    mutationRate: 0.2,
    eliteCount: 4,
    maxRandomAttempts: 40,
  },
};

/*
Input JSON format
{
  "events": [
    {
      "id": "event-1",
      "teacherId": "teacher-a",
      "classId": "class-x",
      "roomId": "room-1",
      "allowedSlotIds": ["slot-1", "slot-2"],
      "blockedSlotIds": ["slot-9"],
      "fixedSlotId": "slot-2"
    }
  ],
  "slots": [
    { "id": "slot-1", "day": "Mon", "start": "08:00", "end": "09:00" }
  ],
  "constraints": {
    "hard": {
      "noOverlapBy": ["teacherId", "classId", "roomId"],
      "eventAllowedSlots": { "event-1": ["slot-1", "slot-2"] },
      "eventBlockedSlots": { "event-1": ["slot-9"] }
    },
    "soft": {
      "slotPenalties": [{ "slotId": "slot-1", "penalty": 3 }],
      "eventSlotPenalties": [
        { "eventId": "event-1", "slotId": "slot-1", "penalty": 5 }
      ],
      "eventPreferredSlots": [
        { "eventId": "event-1", "slotIds": ["slot-2"], "penalty": 2 }
      ]
    }
  },
  "options": {
    "ga": { "populationSize": 30, "generations": 60 }
  }
}

Output JSON format
{
  "feasible": true,
  "penalty": 4,
  "runtime": { "cpSatMs": 12, "gaMs": 34, "totalMs": 46 },
  "schedule": {
    "assignments": [{ "eventId": "event-1", "slotId": "slot-2" }],
    "unassigned": []
  }
}
*/

function normalizeInput(payload) {
  const events = Array.isArray(payload?.events) ? payload.events : [];
  const slots = Array.isArray(payload?.slots) ? payload.slots : [];
  const constraints = payload?.constraints || {};
  const options = {
    ga: { ...DEFAULT_OPTIONS.ga, ...(payload?.options?.ga || {}) },
  };

  return { events, slots, constraints, options };
}

function buildSlotIndex(slots) {
  const slotIds = slots.map((slot) => slot.id).filter(Boolean);
  const slotSet = new Set(slotIds);
  return { slotIds, slotSet };
}

function buildEventDomains(events, slotIds, constraints) {
  const hard = constraints?.hard || {};
  const allowedMap = hard.eventAllowedSlots || {};
  const blockedMap = hard.eventBlockedSlots || {};

  return events.map((event) => {
    let domain = slotIds.slice();
    const allowedSlots = event.allowedSlotIds || allowedMap[event.id];
    const blockedSlots = event.blockedSlotIds || blockedMap[event.id];

    if (event.fixedSlotId) {
      domain = [event.fixedSlotId];
    } else if (Array.isArray(allowedSlots) && allowedSlots.length > 0) {
      domain = domain.filter((slotId) => allowedSlots.includes(slotId));
    }

    if (Array.isArray(blockedSlots) && blockedSlots.length > 0) {
      domain = domain.filter((slotId) => !blockedSlots.includes(slotId));
    }

    return domain;
  });
}

function shuffle(values) {
  const array = values.slice();
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createUsageTracker(resourceKeys) {
  const tracker = new Map();
  resourceKeys.forEach((key) => tracker.set(key, new Map()));
  return tracker;
}

function canAssign(event, slotId, resourceKeys, usage) {
  return resourceKeys.every((key) => {
    const value = event[key];
    if (!value) return true;
    const resourceMap = usage.get(key);
    const usedSlots = resourceMap.get(value);
    return !usedSlots || !usedSlots.has(slotId);
  });
}

function assign(event, slotId, resourceKeys, usage) {
  resourceKeys.forEach((key) => {
    const value = event[key];
    if (!value) return;
    const resourceMap = usage.get(key);
    if (!resourceMap.has(value)) resourceMap.set(value, new Set());
    resourceMap.get(value).add(slotId);
  });
}

function unassign(event, slotId, resourceKeys, usage) {
  resourceKeys.forEach((key) => {
    const value = event[key];
    if (!value) return;
    const resourceMap = usage.get(key);
    const usedSlots = resourceMap.get(value);
    if (!usedSlots) return;
    usedSlots.delete(slotId);
    if (usedSlots.size === 0) resourceMap.delete(value);
  });
}

function cpSatSolve(events, slots, constraints, useRandomOrder = false) {
  const { slotIds } = buildSlotIndex(slots);
  const domains = buildEventDomains(events, slotIds, constraints);
  const hard = constraints?.hard || {};
  const resourceKeys = hard.noOverlapBy || ["teacherId", "classId", "roomId"];

  const order = events
    .map((event, index) => ({ index, size: domains[index].length }))
    .sort((a, b) => a.size - b.size);
  const sortedIndexes = order.map((item) => item.index);

  const assignment = Array(events.length).fill(null);
  const usage = createUsageTracker(resourceKeys);

  function backtrack(position) {
    if (position >= sortedIndexes.length) return true;
    const eventIndex = sortedIndexes[position];
    const domain = useRandomOrder
      ? shuffle(domains[eventIndex])
      : domains[eventIndex];

    for (const slotId of domain) {
      if (!slotId) continue;
      if (!canAssign(events[eventIndex], slotId, resourceKeys, usage)) continue;
      assignment[eventIndex] = slotId;
      assign(events[eventIndex], slotId, resourceKeys, usage);
      if (backtrack(position + 1)) return true;
      unassign(events[eventIndex], slotId, resourceKeys, usage);
      assignment[eventIndex] = null;
    }
    return false;
  }

  const feasible = backtrack(0);
  return { feasible, assignment, domains, resourceKeys };
}

function buildPenaltyMaps(soft) {
  const slotPenalty = new Map();
  const eventSlotPenalty = new Map();
  const preferredSlots = new Map();

  (soft?.slotPenalties || []).forEach((item) => {
    if (!item?.slotId) return;
    slotPenalty.set(item.slotId, Number(item.penalty) || 0);
  });

  (soft?.eventSlotPenalties || []).forEach((item) => {
    if (!item?.eventId || !item?.slotId) return;
    const key = `${item.eventId}::${item.slotId}`;
    eventSlotPenalty.set(key, Number(item.penalty) || 0);
  });

  (soft?.eventPreferredSlots || []).forEach((item) => {
    if (!item?.eventId || !Array.isArray(item.slotIds)) return;
    preferredSlots.set(item.eventId, {
      slotIds: new Set(item.slotIds),
      penalty: Number(item.penalty) || 0,
    });
  });

  return { slotPenalty, eventSlotPenalty, preferredSlots };
}

function calculatePenalty(events, assignment, soft) {
  const maps = buildPenaltyMaps(soft);
  let penalty = 0;

  events.forEach((event, index) => {
    const slotId = assignment[index];
    if (!slotId) return;
    penalty += maps.slotPenalty.get(slotId) || 0;
    penalty += maps.eventSlotPenalty.get(`${event.id}::${slotId}`) || 0;
    const preferred = maps.preferredSlots.get(event.id);
    if (preferred && !preferred.slotIds.has(slotId)) {
      penalty += preferred.penalty;
    }
  });

  return penalty;
}

function isAssignmentValid(events, assignment, domains, resourceKeys) {
  const usage = createUsageTracker(resourceKeys);
  for (let i = 0; i < events.length; i += 1) {
    const slotId = assignment[i];
    if (!slotId) return false;
    if (!domains[i].includes(slotId)) return false;
    if (!canAssign(events[i], slotId, resourceKeys, usage)) return false;
    assign(events[i], slotId, resourceKeys, usage);
  }
  return true;
}

function repairAssignment(events, assignment, domains, resourceKeys) {
  const usage = createUsageTracker(resourceKeys);
  const fixed = assignment.slice();

  for (let i = 0; i < events.length; i += 1) {
    const slotId = fixed[i];
    if (!slotId || !domains[i].includes(slotId)) {
      fixed[i] = null;
      continue;
    }
    if (!canAssign(events[i], slotId, resourceKeys, usage)) {
      fixed[i] = null;
      continue;
    }
    assign(events[i], slotId, resourceKeys, usage);
  }

  const openIndexes = events
    .map((_, index) => index)
    .filter((index) => fixed[index] === null);

  for (const index of openIndexes) {
    const domain = shuffle(domains[index]);
    let placed = false;
    for (const slotId of domain) {
      if (!canAssign(events[index], slotId, resourceKeys, usage)) continue;
      fixed[index] = slotId;
      assign(events[index], slotId, resourceKeys, usage);
      placed = true;
      break;
    }
    if (!placed) return null;
  }

  return fixed;
}

function mutateAssignment(events, assignment, domains, resourceKeys, rate) {
  const mutated = assignment.slice();
  const usage = createUsageTracker(resourceKeys);

  mutated.forEach((slotId, index) => {
    if (slotId && domains[index].includes(slotId)) {
      assign(events[index], slotId, resourceKeys, usage);
    }
  });

  for (let i = 0; i < events.length; i += 1) {
    if (Math.random() > rate) continue;
    const domain = shuffle(domains[i]);
    for (const candidate of domain) {
      if (!canAssign(events[i], candidate, resourceKeys, usage)) continue;
      const current = mutated[i];
      if (current) {
        unassign(events[i], current, resourceKeys, usage);
      }
      mutated[i] = candidate;
      assign(events[i], candidate, resourceKeys, usage);
      break;
    }
  }

  return mutated;
}

function generateRandomFeasible(events, slots, constraints) {
  const result = cpSatSolve(events, slots, constraints, true);
  if (!result.feasible) return null;
  return result.assignment;
}

function gaOptimize({ events, slots, constraints, options, seedAssignment }) {
  const start = Date.now();
  const hard = constraints?.hard || {};
  const { slotIds } = buildSlotIndex(slots);
  const domains = buildEventDomains(events, slotIds, constraints);
  const resourceKeys = hard.noOverlapBy || ["teacherId", "classId", "roomId"];
  const soft = constraints?.soft || {};

  const population = [];

  if (seedAssignment && isAssignmentValid(events, seedAssignment, domains, resourceKeys)) {
    population.push(seedAssignment);
  }

  const attempts = options.ga.maxRandomAttempts;
  while (population.length < options.ga.populationSize && population.length < attempts) {
    const candidate = generateRandomFeasible(events, slots, constraints);
    if (candidate) population.push(candidate);
    if (!candidate) break;
  }

  if (population.length === 0) {
    return { penalty: Infinity, assignment: null, runtimeMs: Date.now() - start };
  }

  function score(assignment) {
    return calculatePenalty(events, assignment, soft);
  }

  let best = population[0];
  let bestPenalty = score(best);

  for (let generation = 0; generation < options.ga.generations; generation += 1) {
    const scored = population.map((candidate) => ({
      candidate,
      penalty: score(candidate),
    }));

    scored.sort((a, b) => a.penalty - b.penalty);

    if (scored[0].penalty < bestPenalty) {
      bestPenalty = scored[0].penalty;
      best = scored[0].candidate;
    }

    const nextPopulation = scored
      .slice(0, options.ga.eliteCount)
      .map((item) => item.candidate);

    while (nextPopulation.length < options.ga.populationSize) {
      const parentA = scored[Math.floor(Math.random() * scored.length)].candidate;
      const parentB = scored[Math.floor(Math.random() * scored.length)].candidate;
      let child = parentA.slice();

      for (let i = 0; i < events.length; i += 1) {
        if (Math.random() < 0.5) child[i] = parentB[i];
      }

      child = repairAssignment(events, child, domains, resourceKeys);
      if (!child) continue;

      child = mutateAssignment(
        events,
        child,
        domains,
        resourceKeys,
        options.ga.mutationRate
      );

      if (!isAssignmentValid(events, child, domains, resourceKeys)) {
        continue;
      }

      nextPopulation.push(child);
    }

    population.splice(0, population.length, ...nextPopulation);
  }

  return { penalty: bestPenalty, assignment: best, runtimeMs: Date.now() - start };
}

export function runScheduler(payload) {
  const start = Date.now();
  const normalized = normalizeInput(payload);
  const cpStart = Date.now();
  const cpResult = cpSatSolve(
    normalized.events,
    normalized.slots,
    normalized.constraints
  );
  const cpSatMs = Date.now() - cpStart;

  if (!cpResult.feasible) {
    return {
      feasible: false,
      penalty: Infinity,
      runtime: { cpSatMs, gaMs: 0, totalMs: Date.now() - start },
      schedule: {
        assignments: [],
        unassigned: normalized.events.map((event) => ({
          eventId: event.id,
          reason: "no_feasible_slot",
        })),
      },
    };
  }

  const gaResult = gaOptimize({
    events: normalized.events,
    slots: normalized.slots,
    constraints: normalized.constraints,
    options: normalized.options,
    seedAssignment: cpResult.assignment,
  });

  const finalAssignment = gaResult.assignment || cpResult.assignment;
  const penalty =
    gaResult.assignment && Number.isFinite(gaResult.penalty)
      ? gaResult.penalty
      : calculatePenalty(
          normalized.events,
          finalAssignment,
          normalized.constraints?.soft
        );

  return {
    feasible: true,
    penalty,
    runtime: {
      cpSatMs,
      gaMs: gaResult.runtimeMs || 0,
      totalMs: Date.now() - start,
    },
    schedule: {
      assignments: normalized.events.map((event, index) => ({
        eventId: event.id,
        slotId: finalAssignment[index],
      })),
      unassigned: [],
    },
  };
}
