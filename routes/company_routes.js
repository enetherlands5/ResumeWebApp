var express = require('express');
var router = express.Router();
var company_dal = require('../model/company_dal');



router.get('/all', function(req, res) {
    company_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('company/companyViewAll', { 'result':result });
        }
    });

});

// Return the add a new company form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    company_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('company/companyAdd', {'company': result});
        }
    });
});

// insert a company record
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.company_name == null) {
        res.send('company Name must be provided.');
    }
    else if(req.query.company_id == null) {
        res.send('An company must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        company_dal.insert(req.query, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/company/all');
            }
        });
    }
});

// Delete a company for the given company_id
router.get('/delete', function(req, res){
    if(req.query.company_id == null) {
        res.send('company_id is null');
    }
    else {
        company_dal.delete(req.query.company_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/company/all');
            }
        });
    }
});

module.exports = router;