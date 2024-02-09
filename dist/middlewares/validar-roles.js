"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tieneRole = exports.esAdminRol = void 0;
const esAdminRol = (req, res, next) => {
    if (!req.app.locals) {
        return res.status(500).json({
            msg: 'Se requiere verificar el role sin validar el token primero'
        });
    }
    ;
    const usuarioPeticion = req.app.locals;
    if (usuarioPeticion.role !== 'ROLE_ADMIN') {
        return res.status(401).json({
            msg: `El  usuario ${usuarioPeticion.nombre} no es administrador, no puede realizar la operacion mencionada`
        });
    }
    next();
};
exports.esAdminRol = esAdminRol;
const tieneRole = (...roles) => {
    return (req, res, next) => {
        if (!req.app.locals) {
            return res.status(500).json({
                msg: 'Se requiere verificar el role sin validar el token primero'
            });
        }
        ;
        if (!roles.includes(req.app.locals.role)) {
            return res.status(401).json({
                msg: `El Servicio requiere uno de estos roles ${roles}`
            });
        }
        next();
    };
};
exports.tieneRole = tieneRole;
//# sourceMappingURL=validar-roles.js.map