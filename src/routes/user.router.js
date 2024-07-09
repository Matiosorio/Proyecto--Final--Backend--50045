const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();
const { isAdmin } = require('../middleware/auth.middleware.js');
const upload = require("../middleware/multer.js");

router.post("/", userController.registerUser);
router.get("/failedregister", userController.failedRegister);

//Tercer integradora: 
router.post("/requestPasswordReset", userController.requestPasswordReset); // Nueva ruta
router.post('/reset-password', userController.resetPassword);
router.put("/premium/:uid", userController.changeRolePremium);

//Middleware Multer

router.post("/:uid/documents", upload.fields([{ name: "document" }, { name: "products" }, { name: "profile" }]), async (req, res) => {
    const { uid } = req.params;
    const uploadedDocuments = req.files;

    try {
        const user = await userRepository.findById(uid);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        //Verficar subida de documentos y actualización del usuario: 

        if (uploadedDocuments) {
            if (uploadedDocuments.document) {
                user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }

            if (uploadedDocuments.products) {
                user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }

            if (uploadedDocuments.profile) {
                user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }
        }

        //Guardamos los cambios en la base de datos: 

        await user.save();

        res.status(200).send("Documentos cargados exitosamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error interno del servidor");
    }
})

// Rutas para la administración de usuarios
router.get("/users", isAdmin, userController.adminUsersView);
router.delete("/inactive", isAdmin, userController.deleteInactiveUsers);


module.exports = router;
