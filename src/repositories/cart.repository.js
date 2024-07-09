const CartModel = require("../models/cart.model.js");
const logger = require("../utils/logger");

class CartRepository {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            logger.error("Error al crear un cart", error);
            throw new Error("Error al crear un cart", error);
        }
    }

    async getCartProducts(cartId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                this.logger.warning("No hay cart con el id solicitado");
                return null;
            }

            return cart;
        } catch (error) {
            logger.error("Error al obtener cart por id", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartProducts(cartId);
            const productExist = cart.products.find(item => item.product._id.toString() === productId);

            if (productExist) {
                productExist.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            logger.error("Error al agregar producto", error);
            throw error;
        }
    }

    async deleteCartProduct(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Cart no encontrado');
            }

            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

            await cart.save();
            return cart;
        } catch (error) {
            logger.error('Error al eliminar el producto del cart', error);
            throw error;
        }
    }

    async updateProductstInCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Cart no encontrado');
            }

            cart.products = updatedProducts;

            cart.markModified('products');

            await cart.save();

            return cart;
        } catch (error) {
            logger.error('Error al actualizar el cart', error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Cart no encontrado');
            }

            const productIndex = cart.products.findIndex(item => item._id.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;

                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el cart');
            }
        } catch (error) {
            logger.error('Error al actualizar la cantidad del producto', error);
            throw error;
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Cart no encontrado');
            }

            return cart;
        } catch (error) {
            logger.error('Error al vaciar el cart', error);
            throw error;
        }
    }
}

module.exports = CartRepository;