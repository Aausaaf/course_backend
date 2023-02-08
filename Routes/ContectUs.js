const express = require("express")
const { ContectUs, getContectUSData, ChangeContectusData, AddContectInfoData } = require("../handlers/ContectUs")

const contectUsRoutes = express.Router()


contectUsRoutes.post("/postcontectmessage",ContectUs)
contectUsRoutes.get("/contectinfo",getContectUSData)
contectUsRoutes.patch("/editcontectinfo",ChangeContectusData)
contectUsRoutes.post("/addcontectinfo",AddContectInfoData)
module.exports = {
   contectUsRoutes 
}