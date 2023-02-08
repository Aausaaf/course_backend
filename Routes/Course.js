const express = require('express')
const { getCourseData, postCourseData, editCourseData, DeleteCourse, getPerticularCourse } = require('../handlers/Course')
const CourseRoutes = express.Router()

CourseRoutes.get('/getcourse/:category',getCourseData)
CourseRoutes.post('/addcourse',postCourseData)
CourseRoutes.patch('/editcourse/:courseId',editCourseData)
CourseRoutes.delete('/deletecourse',DeleteCourse)
CourseRoutes.get('/getcourses/:id',getPerticularCourse)
module.exports = {
    CourseRoutes
}