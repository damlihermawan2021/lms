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
  internalService.listNodes(
    reqData,
    res,
    next,
    function (resData) {
      const data = []
      resData.nodes.forEach(function (item) {
        data.push({
          id: item.node._id ? item.node._id : null,
          nameStudent: item.node.nameStudent ? `<a href='${'/layout/' + item.node._id}'>${item.node.nameStudent}</a>` : null,
          ageStudent: item.node.ageStudent ? item.node.ageStudent : null,
          lastEducationStudent: item.node.lastEducationStudent ? item.node.lastEducationStudent : null,
          subjects: item.node.subjects ? item.node.subjects : null,
          firstDateStudent: item.node.firstDateStudent ? item.node.firstDateStudent : null,
          lastDateStudent: item.node.lastDateStudent ? item.node.lastDateStudent : null,
          links: {
            view: {
              url: '/layout/' + item.node._id,
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
      nameStudent: req.body.nameStudent,
      ageStudent: req.body.ageStudent,
      lastEducationStudent: req.body.lastEducationStudent,
      subjects: req.body.subjects,
      firstDateStudent: req.body.firstDateStudent,
      lastDateStudent: req.body.lastDateStudent,
    }
  }

  internalService.createNode(reqData, res, next, function (resData) {
    res.status(200).send({
      links: {
        view: {
          url: '/layout/' + resData.node._id,
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
        nameStudent: item.node.nameStudent ? item.node.nameStudent : null,
        ageStudent: item.node.ageStudent ? item.node.ageStudent : null,
        lastEducationStudent: item.node.lastEducationStudent ? item.node.lastEducationStudent : null,
        subjects: item.node.subjects ? item.node.subjects : null,
        firstDateStudent: item.node.firstDateStudent ? item.node.firstDateStudent : null,
        lastDateStudent: item.node.lastDateStudent ? item.node.lastDateStudent : null,
        links: {
          delete: {
            url: '/layout/' + item.node._id,
            method: 'DELETE'
          },
          edit: {
            url: '/layout/' + item.node._id + '/' + item.node.name,
            method: 'PUT'
          }
        }
      })
    })

  })
})

router.get('/', function (req, res, next) {
  res.render('layout', {
  })
})

module.exports = router