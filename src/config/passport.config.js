import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import bcrypt from "bcrypt";
import { mongooseSchema as User } from "../models/user.model.js";
import { cartModel } from "../models/cart.model.js";

/**
 * Inicializa Passport
 * @returns {void} - La inicialización de Passport
 */
export const initializePassport = () => {
  /**
   * Estrategia Local: registro de usuario
   */
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;

          if (!first_name || !last_name || !age) {
            return done(null, false, { message: "Missing required fields" });
          }

          const user = await User.findOne({ email });

          // Si el usuario ya existe, realizar un comportamiento idempotente de "registro":
          // actualizar contraseña y completar datos faltantes en lugar de fallar
          if (user) {
            const hashedPassword = bcrypt.hashSync(password, 10);
            let cartId = user.cart;
            if (!cartId) {
              const createdCart = await cartModel.create({ products: [] });
              cartId = createdCart._id;
              user.cart = cartId;
            }

            user.first_name = first_name || user.first_name;
            user.last_name = last_name || user.last_name;
            user.age = age || user.age;
            user.password = hashedPassword;

            const saved = await user.save();
            const plain = saved.toObject();
            delete plain.password;
            return done(null, plain);
          }

          const hashedPassword = bcrypt.hashSync(password, 10);

          // Crear un carrito vacío para el usuario
          const newCart = await cartModel.create({ products: [] });

          const newUser = await User.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            cart: newCart._id,
          });

          // Sanitizar respuesta para no exponer password
          const plain = newUser.toObject();
          delete plain.password;

          return done(null, plain);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  /**
   * Estrategia Local: login de usuario
   */
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email }).lean();

          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          const isPasswordValid = bcrypt.compareSync(password, user.password);

          if (!isPasswordValid) {
            return done(null, false, { message: "Invalid password" });
          }

          delete user.password;

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  /**
   * Estrategia JWT
   */
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: (req) => {
          let token = null;
          const auth = req?.headers?.authorization;
          if (auth && auth.startsWith("Bearer ")) {
            token = auth.substring(7);
          } else if (req && req.cookies) {
            token = req.cookies.token;
          }
          return token;
        },
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await User.findById(jwt_payload.user._id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  /**
   * Alias "current" (igual a JWT) para /api/sessions/current
   */
  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: (req) => {
          let token = null;
          const auth = req?.headers?.authorization;
          if (auth && auth.startsWith("Bearer ")) {
            token = auth.substring(7);
          } else if (req && req.cookies) {
            token = req.cookies.token;
          }
          return token;
        },
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await User.findById(jwt_payload.user._id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // No se serializa/deserializa usuario debido a que no se usan sesiones de Passport
};
