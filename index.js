const url = require("url");
const { send, json } = require("micro");
const { Validator } = require("jsonschema");
const {
  randPastDate,
  randNumber,
  randTextRange,
  rand,
  incrementalNumber,
} = require("@ngneat/falso");
const cors = require("micro-cors")();

const idGen = incrementalNumber();

let EXPENSES = new Array(111).fill(true).map(() => buildExpense());
const NATURES = ["restaurant", "trip"];

const schema = {
  id: "/Expense",
  type: "object",
  oneOf: [
    {
      properties: {
        nature: { const: "restaurant" },
        id: { type: "number" },
        purchasedOn: { type: "string", format: "date" },
        amount: { type: "number" },
        comment: { type: "string" },
        invites: { type: "number" },
        updatedAt: { type: "string", format: "date-time" },
      },
      additionalProperties: false,
      required: ["nature", "purchasedOn", "amount", "invites"],
    },
    {
      properties: {
        nature: { const: "trip" },
        id: { type: "number" },
        purchasedOn: { type: "string", format: "date" },
        amount: { type: "number" },
        comment: { type: "string" },
        distance: { type: "number" },
        updatedAt: { type: "string", format: "date-time" },
      },
      additionalProperties: false,
      required: ["nature", "purchasedOn", "amount", "distance"],
    },
  ],
};
const validator = new Validator();

module.exports = cors(async (req, res) => {
  const parsedUrl = url.parse(req.url);

  if (req.method === "OPTIONS") {
    return send(res, 200, "ok!");
  }

  if (parsedUrl.pathname === "/natures" && req.method === "GET") {
    send(res, 200, NATURES);
    return;
  }

  if (parsedUrl.pathname === "/expenses") {
    if (req.method === "GET") {
      const params = new URLSearchParams(parsedUrl.query);
      const page = parseInt(params.get("page"), 10) || 1;
      const limit = parseInt(params.get("limit"), 10) || EXPENSES.length;
      res.setHeader("Access-Control-Expose-Headers", "*");
      send(res, 200, {
        items: EXPENSES.sort(({ updatedAt: u1 }, { updatedAt: u2 }) =>
          u1 > u2 ? -1 : 1,
        ).slice((page - 1) * limit, page * limit),
        count: EXPENSES.length,
      });
      return;
    }

    if (req.method === "POST") {
      const expense = {
        ...(await json(req)),
        updatedAt: new Date().toISOString(),
      };
      const validation = validator.validate(expense, schema);
      if (validation.valid) {
        EXPENSES = [...EXPENSES, { id: idGen(), ...expense }];
        send(res, 201);
        return;
      }
      send(res, 400, validation.errors);
      return;
    }
  }

  const match = parsedUrl.pathname.match(/\/expenses\/([0-9]+)/);
  if (match) {
    const id = parseInt(match[1], 10);
    const expensePos = EXPENSES.findIndex((e) => e.id === id);
    if (expensePos >= 0) {
      if (req.method === "GET") {
        send(res, 200, EXPENSES.at(expensePos));
        return;
      }

      if (req.method === "PUT") {
        const expense = {
          ...(await json(req)),
          updatedAt: new Date().toISOString(),
        };
        const validation = validator.validate(expense, schema);
        if (validation.valid) {
          EXPENSES[expensePos] = expense;
          send(res, 200, expense);
          return;
        }
        send(res, 400, validation.errors);
        return;
      }
    }
  }

  send(res, 404, parsedUrl);
  return;
});

function buildExpense() {
  const nature = rand(["trip", "restaurant"]);
  const expense = {
    id: idGen(),
    nature,
    amount: randNumber({ min: 10, max: 1000 }),
    comment: randTextRange({ min: 10, max: 100 }),
    purchasedOn: randPastDate().toISOString().substring(0, 10),
    updatedAt: randPastDate().toISOString(),
  };

  return nature === "trip"
    ? { ...expense, distance: randNumber({ min: 10, max: 1000 }) }
    : { ...expense, invites: randNumber({ min: 0, max: 3 }) };
}
