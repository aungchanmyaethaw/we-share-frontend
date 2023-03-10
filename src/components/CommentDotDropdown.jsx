import axios from "axios";
import React, { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useAppContext, API_URL } from "../context/AppContext";
import { EditModal } from "./EditModal";

const CommentDotDropdown = ({ commentId, postId, userId }) => {
  const { authedUser, jwt, setComments } = useAppContext();
  const [postOwnerId, setPostOwnerId] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    getSinglepostId();
  }, []);

  const getSinglepostId = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setPostOwnerId(data.data.attributes.userId);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteComment = async () => {
    try {
      axios.delete(`${API_URL}/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (e) {
      console.log(e);
    }
  };

  const isAllowed = authedUser.id === userId || authedUser.id === postOwnerId;

  if (!isAllowed) {
    return null;
  }

  return (
    <div className="dropdown dropdown-left w-2 h-2 -mt-1">
      <label tabIndex={0}>
        <button>
          <BsThreeDots color="#ee6640" />
        </button>
      </label>
      <div
        tabIndex={0}
        className="dropdown-content menu py-2 px-3 shadow bg-dark-200 outline outline-1 outline-white rounded-box "
      >
        {authedUser.id === userId && (
          <button
            className="btn btn-outline hover:outline hover:-outline-offset-1 hover:outline-1 hover:outline-primary mb-2 text-white outline-white hover:bg-dark-200 hover:text-primary btn-xs h-2"
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </button>
        )}
        {isAllowed && (
          <button
            className="btn btn-xs bg-primary text-white hover:bg-orange-700 hover:scale-110 h-2"
            onClick={deleteComment}
          >
            Delete
          </button>
        )}
      </div>
      {showEditModal ? (
        <EditModal
          id={commentId}
          setShowEditModal={setShowEditModal}
          isCommentPage={true}
        />
      ) : null}
    </div>
  );
};

export default CommentDotDropdown;
