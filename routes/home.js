const express = require('express')
const router = express.Router()
const internalService = require('../lib/InternalService')

router.get('/', function (Req,res,nex){
  res.render('home')
})
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
          id: item.node._id ? item.node._id : '-',
          // `<a href="/${item.node._id}"> ${item.node.studentName} </a>`
          nameStudent:item.node.nameStudent ? item.node.nameStudent : '-',
          ageStudent: item.node.ageStudent ? item.node.ageStudent : '-',
          lastEducationStudent: item.node.lastEducationStudent ? item.node.lastEducationStudent : '-',
          subjectStudent: item.node.subjectStudent ? item.node.subjectStudent : '-',
          firstDateStudent: item.node.firstDateStudent ? item.node.firstDateStudent : '-',
          lastDateStudent: item.node.lastDateStudent ? item.node.lastDateStudent : '-',
          links: {
            view: {
              url: '/' + item.node._id,
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

router.post('/data',function (req,res,next){
  const reqData = {
    label : 'Test',
    isMerge : true,
    properties: {
      nameStudent: req.body.nameStudent,
      ageStudent: req.body.ageStudent,
      lastEducationStudent: req.body.lastEducationStudent,
      subjectStudent: req.body.subjectStudent,
      firstDateStudent: req.body.firstDateStudent,
      lastDateStudent: req.body.lastDateStudent
  }
}
internalService.createNode(reqData, res, next, function (resData) {
  res.status(200).send({
    links: {
      view: {
        url: '/' + resData.node._id,
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
  resData.nodes.forEach(function (item) {
    data = ({
      id: item.node._id ? item.node._id : '-',
      nameStudent: item.node.nameStudent ? item.node.nameStudent : '-',
      ageStudent: item.node.ageStudent ? item.node.ageStudent : '-',
      lastEducationStudent: item.node.lastEducationStudent ? item.node.lastEducationStudent : '-',
      subjectStudent: item.node.subjectStudent ? item.node.subjectStudent : '-',
      firstDateStudent: item.node.firstDateStudent ? item.node.firstDateStudent : '-',
      lastDateStudent: item.node.lastDateStudent ? item.node.lastDateStudent : '-',
      links: {
        delete: {
          url: '/' + item.node._id,
          method: 'DELETE'
        },
        edit: {
          url: '/' + item.node._id + '/' + item.node.nameStudent,
          method: 'PUT'
        }
      }
    })
  })
  res.render('tabInfo', {
    data: JSON.stringify(data)
    })    
  })
})

router.put('/:_id', function (req, res, next) {
  const _id = req.params._id
  const reqData = {
    label: 'Test',
    id: _id,
    isMerge: true,
    properties: {}
  }
  reqData.properties = req.body.value

  internalService.updateNode(reqData, res, next, function (resData) {
    res.status(200).send({
      links: {
        view: {
          url: '/' + _id,
          method: 'GET'
        }
      }
    })
  })
})

router.delete('/:_id', function (req, res, next) {
  const _id = req.params._id
  internalService.deleteNode(_id, res, next, function (resData) {
    res.status(200).send({
      links: {
        index: {
          url: '/',
          method: 'GET'
        }
      }
    })
  })
})

module.exports = router