import { auth } from "../firebase.config";
import { setCartUser } from "../slices/cartSlice";
import { setWishlistUser } from "../slices/wishlistSlice";

const syncUserData = (dispatch) => {
  const userId = auth.currentUser?.uid;
  dispatch(setCartUser(userId));
  dispatch(setWishlistUser(userId));
};

export default syncUserData;
