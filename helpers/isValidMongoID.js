const mongoose = require('mongoose');

const isValidMonoID = (id) => {
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.render('error');
    }
}

module.exports = isValidMonoID;