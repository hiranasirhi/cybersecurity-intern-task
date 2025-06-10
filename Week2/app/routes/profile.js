// app/routes/profile.js
const validator = require("validator");
const ProfileDAO = require("../data/profile-dao").ProfileDAO;
const ESAPI = require("node-esapi");

function ProfileHandler(db) {
    const profile = new ProfileDAO(db);

    // Display Profile (uses JWT payload instead of session)
    this.displayProfile = (req, res, next) => {
        const userId = req.jwtPayload?.id;

        if (!userId) return res.status(401).send("Unauthorized");

        profile.getByUserId(parseInt(userId), (err, doc) => {
            if (err) return next(err);

            doc.userId = userId;

            // Encode for URL context
            doc.website = ESAPI.encoder().encodeForURL(doc.website);

            return res.render("profile", doc);
        });
    };

    // Handle Profile Update
    this.handleProfileUpdate = (req, res, next) => {
        const { firstName, lastName, ssn, dob, address, bankAcc, bankRouting } = req.body;
        const userId = req.jwtPayload?.id;

        if (!userId) return res.status(401).send("Unauthorized");

        // Input validation
        if (!validator.isAlphanumeric(firstName)) {
            return res.status(400).send("Invalid first name.");
        }
        if (!validator.isAlphanumeric(lastName)) {
            return res.status(400).send("Invalid last name.");
        }
        if (!validator.isDate(dob)) {
            return res.status(400).send("Invalid date of birth.");
        }
        if (!validator.isNumeric(bankAcc)) {
            return res.status(400).send("Bank account must be numeric.");
        }
        if (!/^[0-9]+#$/.test(bankRouting)) {
            return res.status(400).send("Bank routing format must be numbers followed by #.");
        }

        // Optional: trim and sanitize input fields
        const sanitizedFirstName = validator.escape(firstName.trim());
        const sanitizedLastName = validator.escape(lastName.trim());

        profile.updateUser(
            parseInt(userId),
            sanitizedFirstName,
            sanitizedLastName,
            ssn,
            dob,
            address,
            bankAcc,
            bankRouting,
            (err, user) => {
                if (err) return next(err);

                user.updateSuccess = true;
                user.userId = userId;

                return res.render("profile", user);
            }
        );
    };
}

module.exports = ProfileHandler;
