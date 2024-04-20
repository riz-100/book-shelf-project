import { useContext } from "react";
import RatingMeter from "./RatingMeter";
import ReviewComponent from "./ReviewComponent";
import { useParams } from "react-router-dom";
import UserContext from "../UserContext";
import "../CSS/book.css";
import axios from "axios";

const Book = ({
  book,
  buttonText,
  btnClass,
  handleOnClick,
  ratingBtnVisibility,
  reviewInputText,
}) => {
  const { userID } = useParams();
  const { thumbnail, title, author, avgRating, _id } = book;
  const { token } = useContext(UserContext);

  const onClickHandler = async () => {
    handleOnClick(_id);
  };

  return (
    <div className="bookshelf-item">
      <div className="bookshelf-details">
        <h2>{title}</h2>
        <span>{author}</span>
        <img src={thumbnail} alt={title} />
        <span className="rating">Avg Rating: {avgRating?.toFixed(2)}</span>
        <RatingMeter
          bookId={_id}
          userId={userID}
          rate={
            book.ratings.filter((rating) => rating.userId === userID)[0]?.rating
          }
          btnVisibility={ratingBtnVisibility}
        />
        <ReviewComponent bookId={_id} userId={userID} text={reviewInputText} />
        <button className={btnClass} onClick={onClickHandler}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Book;
