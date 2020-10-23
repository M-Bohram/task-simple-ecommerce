import { useEffect, useState } from 'react';
// import ItemImg from '../images/blue_shirt.jpg';
// import { initializeStore } from '../redux'
import { useSelector, useDispatch } from 'react-redux'
import { deleteItem } from '../redux/cart/actions';
import Link from 'next/link';
import styles from '../styles/Cart.module.scss';
import styles2 from '../styles/EmptyCart.module.scss';


function EmptyCart() {
    return (
        <div className={styles2["container"]}>
            <h2 className={styles2["section-title"]}>Cart</h2>
            <div className={styles2["cart-container"]}>
                <div className={styles2["empty-msg"]}>Your cart is empty</div>
                <Link href="/"><div className={styles2["shopping-btn"]}>Continue Shopping</div></Link>
            </div>
        </div>
    )
}

export default function Cart() {

    const dispatch = useDispatch();
    const orderItemsState = useSelector((state) => state.orderItems);
    // const orderItemsState = [];
    const [totalCost, setTotalCost] = useState(0);
    const [orderItems, setOrderItems] = useState([...orderItemsState]);

    const updateTotalCost = () => {
        const newTotalCost = orderItems.reduce((total, orderItem) => (total + orderItem.qty * orderItem.price), 0);
        setTotalCost(newTotalCost);
    }

    useEffect(() => {
        setOrderItems(orderItemsState);
        console.log("orderItemsState", orderItemsState)
    }, [orderItemsState]);

    useEffect(() => {
        updateTotalCost();
        console.log("orderItems", orderItems)
    }, [orderItems]);

    const changeItemQty = (orderItem, isIncrease) => {
        const newOrderItems = [...orderItems];
        const itemIndex = newOrderItems.indexOf(orderItem);
        if (isIncrease && newOrderItems[itemIndex].qty < newOrderItems[itemIndex].availableQuantity) {
            newOrderItems[itemIndex].qty++;
        } else if (!isIncrease && newOrderItems[itemIndex].qty > 1) {
            newOrderItems[itemIndex].qty--;
        }
        const newItemTotalPrice = newOrderItems[itemIndex].qty * newOrderItems[itemIndex].price;
        newOrderItems[itemIndex].totalPrice = newItemTotalPrice;
        setOrderItems(newOrderItems);
        updateTotalCost();
        // dispatch(editToCart(newOrderItems[itemIndex]));
    }

    return (
        orderItems.length == 0 ? <EmptyCart /> : <div className={styles["container"]}>
            <h2 className={styles["section-title"]}>Cart</h2>
            <div className={styles["cart-container"]}>
                <ul className={styles["items"]}>
                    {orderItems.map(orderItem => (
                        <>
                            <li className={styles["item"]}>
                                {/* <img className={styles["item-image"]} src={require(`../images/${orderItem.image}`)} /> */}
                                <img className={styles["item-image"]} src={orderItem.image} />
                                <div className={styles["item-info"]}>
                                    <p className={styles["item-name"]}>{orderItem.name}</p>
                                    <p className={styles["item-price"]}>{orderItem.totalPrice.toFixed(2) + " EGP"}</p>
                                </div>
                                <div className={styles["item-actions"]}>
                                    <div className={styles["item-quantity-container"]}>
                                        <button className={styles["item-decrease-qty"]} onClick={() => changeItemQty(orderItem, false)}>-</button>
                                        <p className={styles["item-quantity"]}>{orderItem.qty}</p>
                                        <button className={styles["item-increase-qty"]} onClick={() => changeItemQty(orderItem, true)}>+</button>
                                    </div>
                                    {/* <p className="item-price">{orderItem.totalPrice.toFixed(2) + " EGP"}</p> */}
                                    <button className={styles["item-delete"]} onClick={() => dispatch(deleteItem(orderItem))}>Delete</button>
                                </div>
                            </li>
                            <hr className={styles["item-separator"]} />
                        </>
                    ))}
                </ul>
                <div className={styles["total-cost"]}>
                    <h4>Total</h4>
                    <h4>{totalCost}</h4>
                </div>
                <div className={styles["checkout"]}>Checkout</div>
            </div>
        </div>
    );
}
