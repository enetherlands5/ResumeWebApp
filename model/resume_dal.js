var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view company_view as
 select s.*, a.street, a.zip_code from company s
 join address a on a.address_id = s.address_id;
 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM company;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(company_id, callback) {
    var query = 'SELECT c.*, a.street, a.zip_code FROM company c ' +
        'LEFT JOIN company_address ca on ca.company_id = c.company_id ' +
        'LEFT JOIN address a on a.address_id = ca.address_id ' +
        'WHERE c.company_id = ?';
    var queryData = [company_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO resume (resume_name, account_id) VALUES (?, ?)';

    var queryData = [params.company_name];

    connection.query(query, params.company_name, function (err, result) {

        // THEN USE THE COMPANY_ID RETURNED AS insertId AND THE SELECTED ADDRESS_IDs INTO COMPANY_ADDRESS
        var company_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO company_address (company_id, address_id) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var resumeSkillData = [];
        if (params.skill_id instanceof Array) {
            for (var i = 0; i < params.skill_id.length; i++)
                resumeSkillData.push([resume_id, params.skill_id[i]]);
        }
        else {
            resumeSkillDatal.push([params.skill_id]);
        }

        var resumeCompanyData = [];
        if (params.company_id instanceof Array) {
            for (var i = 0; i < params.company_id.length; i++)
                resumeCompanyData.push([resume_id, params.company_id[i]]);
        }
        else {
            resumeCompanyData.push([params.company_id])
        }

        var resumeSchoolData = [];
        if (params.school_id instanceof Array) {
            for (var i = 0; i < params.school_id.length; i++)
                resumeSchoolData.push([resume_id, params.school_id[i]]);
        }
        else {
            resumeSchoolData.push([params.school_id])
        }

        // NOTE THE EXTRA [] AROUND companyAddressData
        connection.query(query, [resumeSkillData], function (err, result) {
            callback(err, result);
        });
        connection.query(query, [resumeCompanyData], function (err, result) {
            callback(err, result);
        });
        connection.query(query, [resumeSchoolData], function (err, result) {
            callback(err, result);
        });

    });
};

exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

//declare the function so it can be used locally
var resumeSkillInsert = function(resume_id, skillIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES (?, ?)';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSkillData = [];
    for(var i=0; i < skillIdArray.length; i++) {
        resumeSkillData.push([resume_id, skillIdArray[i]]);
    }
    connection.query(query, [resumeSkillData], function(err, result){
        callback(err, result);
    });
};

var resumeCompanyInsert = function(resume_id, companyIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_company (resume_id, company_id) VALUES (?, ?)';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeCompanyData = [];
    for(var i=0; i < companyIdArray.length; i++) {
        resumeCompanyData.push([resume_id, companyIdArray[i]]);
    }
    connection.query(query, [resumeCompanyData], function(err, result){
        callback(err, result);
    });
};

var resumeSchoolInsert = function(resume_id, schoolIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_school (resume_id, skill_id) VALUES (?, ?)';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSchoolData = [];
    for(var i=0; i < schoolIdArray.length; i++) {
        resumeSchoolData.push([resume_id, schoolIdArray[i]]);
    }
    connection.query(query, [resumeSchoolData], function(err, result){
        callback(err, result);
    });
};

//export the same function so it can be used by external callers
module.exports.resumeSkillInsert = resumeSkillInsert;

//declare the function so it can be used locally
var resumeSkillDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_school WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeSkillDeleteAll = resumeSkillDeleteAll;


//export the same function so it can be used by external callers
module.exports.resumeCompanyInsert = resumeCompanyInsert;

//declare the function so it can be used locally
var resumeCompanyDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_company WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeCompanyDeleteAll = resumeCompanyDeleteAll;


//export the same function so it can be used by external callers
module.exports.resumeSchoolInsert = resumeSchoolInsert;

//declare the function so it can be used locally
var resumeSchoolDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_school WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeSchoolDeleteAll = resumeSchoolDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_name = ? WHERE resume_id = ?';

    var queryData = [params.resume_name, params.resume_id];

    connection.query(query, queryData, function(err, result) {
        //delete company_address entries for this company
        resumeSkillDeleteAll(params.resume_id, function (err, result) {
            if (params.skill_id != null) {
                //insert company_address ids
                resumeSkillInsert(params.resume_id, params.skill_id, function (err, result) {
                    resumeCompanyDeleteAll(params.resume_id, function (err, result) {
                        resumeCompanyInsert(params.resume_id, params.company_id, function (err, result) {
                            resumeSchoolDeleteAll(params.school_id, function (err, result) {
                                resumeSchoolInsert(params.resume_id, params.school_id, function (err, result) {
                                    resumeAccountDeleteAll(params.account_id, function (err, result) {
                                        resumeAccountInsert(params.resume_id, params.school_id, function (err, result) {
                                            callback(err, result);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
            else {callback(err, result);}
        });

    });
};

/*  Stored procedure used in this example
 DROP PROCEDURE IF EXISTS company_getinfo;
 DELIMITER //
 CREATE PROCEDURE company_getinfo (_company_id int)
 BEGIN
 SELECT * FROM company WHERE company_id = _company_id;
 SELECT a.*, s.company_id FROM address a
 LEFT JOIN company_address s on s.address_id = a.address_id AND company_id = _company_id
 ORDER BY a.street, a.zip_code;
 END //
 DELIMITER ;
 # Call the Stored Procedure
 CALL company_getinfo (4);
 */

exports.edit = function(resume_id, callback) {
    var query = 'CALL resume_getinfo(?)';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};