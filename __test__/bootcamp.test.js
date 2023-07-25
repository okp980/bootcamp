const request = require("supertest")
const app = require("../app")
const connect = require("../db")

const bootcamp = {
  _id: "5d725a037b292f5f8ceff787",
  user: "5c8a1d5b0190b214360dc031",
  name: "Codemasters",
  description:
    "Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible. We specialize in full stack web development and data science",
  website: "https://codemasters.com",
  phone: "(333) 333-3333",
  email: "enroll@codemasters.com",
  address: "85 South Prospect Street Burlington VT 05405",
  careers: ["Web Development", "Data Science", "Business"],
  housing: false,
  jobAssistance: false,
  jobGuarantee: false,
  acceptGi: false,
}

describe("first", () => {
  beforeAll(() => {
    connect()
  })
  describe("GET /bootcamps", () => {
    test("should return with 200 response", async () => {
      const response = await request(app)
        .get("/api/v1/bootcamps")
        .expect("Content-Type", /json/)
        .expect(200)
    })
  })

  describe("POST /bootcamps", () => {
    test("should respond with 201 created", async () => {
      const response = await request(app)
        .post("/api/v1/bootcamps")
        .send(bootcamp)
        .expect("Content-Type", /json/)
        .expect(401)

      expect(response.body.data).toMatchObject(bootcamp)
    })
    test("should catch missing required properties", async () => {
      const missingName = delete bootcamp.name
      const response = await request(app)
        .post("/api/v1/bootcamps")
        .send(missingName)
        .expect("Content-Type", /json/)
        .expect(404)

      expect(response.body.data).toStrictEqual({ error: "Missing name field" })
    })
  })
})
