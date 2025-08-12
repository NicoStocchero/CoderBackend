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

          if (user) {
            return done(null, false, { message: "User already exists" });
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

          delete newUser.password;

          return done(null, newUser);
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
          if (req && req.cookies) {
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
          if (req && req.cookies) {
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

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};
