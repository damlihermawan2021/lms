const express = require('express')
const router = express.Router()
const internalService = require('../lib/InternalService')
//* GET users listing.
router.get('/data', function (req, res, next) {
  const queries = req.query
  const reqData = {
    limit: 0,
    label: 'Test',
    skip: 0,
    propertyFilter: {},
    propertySort: {}
  }
  console.log(reqData)
  internalService.listNodes(
    reqData,
    res,
    next,
    function (resData) {
      const data = []
      resData.nodes.forEach(function (item) {
        data.push({
          id: item.node._id ? item.node._id : null,
          className: item.node.className ? `<a href='${'/class/' + item.node._id}'>${item.node.className}</a>` : null,
          subjects: item.node.subjects ? item.node.subjects : null,
          instructor: item.node.instructor ? item.node.instructor : null,
          studentList: item.node.studentList ? item.node.studentList : null,
          scheduleTime: item.node.scheduleTime ? item.node.scheduleTime : null,
          rollCall: item.node.rollCall ? item.node.rollCall : null,
          links: {
            view: {
              url: '/class/' + item.node._id,
              method: 'GET'
            }
          }
        })
      })
      const result = {
        draw: queries.draw,
        data: data,
        recordsFiltered: resData.pager.total,
        recordsTotal: resData.pager.total
      }

      if (queries.json === 'true') res.status(200).send(result.data)
      else res.send(result)
    },
    function (err) {
      const result = {
        draw: queries.draw,
        data: [],
        recordsFiltered: 0,
        recordsTotal: 0
      }

      if (err.status !== 404) {
        result.error = err.message
      }

      res.status(200).send(result)
    }
  )
})

router.post('/post', function (req, res, next) {
  // console.log(req.query)
  const reqData = {
    label: 'Test',
    isMerge: true,
    properties: {
      className: req.body.className,
      instructor: req.body.instructor,
      studentList: req.body.studentList,
      subjects: req.body.subjects,
      scheduleTime: req.body.scheduleTime,
      rollCall: req.body.rollCall,
    }
  }

  internalService.createNode(reqData, res, next, function (resData) {
    res.status(200).send({
      links: {
        view: {
          url: '/class/' + resData.node._id,
          method: 'POST'
        }
      }
    })
  })
})

router.get('/:_id', function (req, res, next) {
  const _id = req.params._id
  const reqData = {
    label: 'Test',
    skip: 0,
    limit: 1,
    propertyFilter: {
      _id: _id
    }
  }
  internalService.listNodes(reqData, res, next, function (resData) {
    const data = []
    resData.nodes.forEach(function (item) {
      data.push({
        id: item.node._id ? item.node._id : null,
        className: item.node.className ? item.node.className : null,
        instructor: item.node.instructor ? item.node.instructor : null,
        studentList: item.node.studentList ? item.node.studentList : null,
        subjects: item.node.subjects ? item.node.subjects : null,
        scheduleTime: item.node.scheduleTime ? item.node.scheduleTime : null,
        rollCall: item.node.rollCall ? item.node.rollCall : null,
        links: {
          delete: {
            url: '/class/' + item.node._id,
            method: 'DELETE'
          },
          edit: {
            url: '/class/' + item.node._id + '/' + item.node.name,
            method: 'PUT'
          }
        }
      })
    })
    // res.render('default/tabInfo')
  })
})

router.get('/', function (req, res, next) {
  res.render('class', {
    // data: '/inputForm/data'
  })
})

module.exports = router