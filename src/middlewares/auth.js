
const adminAuth = (req, res, next) =>{
    const token = "xyzha";
    const auth = token === "xyz";

    if(!auth){
        res.status(401).send("Unauthozied Entry");
    }
    else {
        next();
    }
};

const userAuth = (req, res, next) =>{
    const token = "xyz";
    const auth = token === "xyz";

    if(!auth){
        res.status(401).send("Unauthozied Entry");
    }
    else {
        next();
    }
};

module.exports = { adminAuth , userAuth};