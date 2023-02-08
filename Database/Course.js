const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      price: {
        type: String,
        required: true}
        ,
        description: {
            type: String,
            // required: true
        },
        image: {
            type: String,
            // required: true
        },
        category: {
            type: String,
            required: true
        },
        duration:{
            type: String,
            required: true
        },
        video:{
            type: String,
        },
        syllabus:{
            type: Array,

        },
        user:{
            type:Array
        }

       
},{timestamps: true})



const Course = mongoose.model('Course',CourseSchema)

module.exports = {
    Course
}