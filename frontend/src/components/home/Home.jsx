import React from "react";
import './Home.css'
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <header className="header">
        <h1>The Chapter House</h1>
        <nav>
          <Link to="/addmember">Add Member</Link>
          <Link to="/managebooks">Manage Books</Link>
          <Link to="/managebooks">Manage Books</Link>
        </nav>
      </header>
      <div className="main">
        <div className="card" id="add-member">
          <img
            src="https://static.vecteezy.com/system/resources/previews/023/087/351/non_2x/add-user-icon-in-line-style-social-media-button-concept-vector.jpg"
            alt="image not found"
          />
          <Link to="/addmember">
            <button className="button">Add Member</button>
          </Link>
        </div>
        <div className="card" id="manage-books">
          <img
            src="https://marketplace.canva.com/D3qec/MAES6PD3qec/1/tl/canva-stack-of-books-icon-MAES6PD3qec.png"
            alt="image not found"
          />
          <Link to="/managebooks">
            <button className="button">Manage Books</button>
          </Link>
        </div>
        <div className="card" id="issue-books">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQFeViYTjhHjVaD3LVGvk0bLnozowz2hVtUw&s"
            alt="image not found"
          />
          <Link to="/issuebooks">
            <button className="button">Issue Books</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
