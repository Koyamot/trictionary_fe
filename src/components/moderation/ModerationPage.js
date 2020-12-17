import { useState, useEffect } from "react";
import { apiGet, apiPut } from "../../api";

import Loading from "../common/Loading";

const ModerationPage = () => {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWord = () => {
    setLoading(true);
    apiGet("/api/words/unmoderated")
      .then((res) => {
        console.log(res.data);
        setWord(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const approve = (e) => {
    e.preventDefault();
    apiPut(`/api/words/${word.id}/approve`)
      .then(() => {
        fetchWord();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const reject = (e) => {
    e.preventDefault();
    apiPut(`/api/words/${word.id}/reject`)
      .then(() => {
        fetchWord();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchWord();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page-container">
      <div className="word-container">
        <h1>{word.word}</h1>
        <h3>{word.definition}</h3>
      </div>
      <div className="mod-buttons">
        <button className="reject" onClick={reject}>
          Reject
        </button>
        <button className="approve" onClick={approve}>
          Approve
        </button>
      </div>
    </div>
  );
};

export default ModerationPage;
