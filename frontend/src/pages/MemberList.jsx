import { useState, useEffect } from "react";
import NavbarSidebar from "../components/NavbarSidebar";
import "../assets/styles/MemberList.css";

import api from "../api/api";

function MemberList() {
  const [members, setMembers] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const response = await api.get("/members");
      const data = response.data;
      setMembers(data);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  const fetchBorrowed = async () => {
    try {
      const response = await api.get("/borrowed");
      const data = response.data;
      setBorrowed(data);
    } catch (error) {
      console.error("Failed to fetch borrowed books:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      const data = response.data;
      setBooks(data.data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchMembers(), fetchBorrowed(), fetchBooks()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Process data to map members to their borrowed books
  const memberBorrowedMap = {};
  borrowed.forEach((b) => {
    if (!memberBorrowedMap[b.member_id]) {
      memberBorrowedMap[b.member_id] = [];
    }
    const book = books.find((book) => book.id === b.book_id);
    if (book) {
      memberBorrowedMap[b.member_id].push({ ...b, book });
    }
  });

  const membersWithBorrowed = members.filter((m) => memberBorrowedMap[m.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavbarSidebar />
      <div className="main">
        {/* <h2>Members with Borrowed Books</h2> */}
        {membersWithBorrowed.length === 0 ? (
          <p>No members have borrowed books.</p>
        ) : (
          membersWithBorrowed.map((member) => (
            <div
              className="container"
              key={member.id}
              style={{
                marginBottom: "20px",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <h3>
                <span>Name: </span> {member.name}
              </h3>
              <p>
                <span>Email: </span> {member.email}
              </p>
              <p>
                <span>Phone: </span> {member.phone}
              </p>
              <p>
                <span>Address: </span> {member.address}
              </p>
              <h4>
                <span>Borrowed Books:</span>
              </h4>
              <ul>
                {memberBorrowedMap[member.id].map((b) => (
                  <li key={b.id}>
                    {b.book.title} by {b.book.author} (Borrowed at:{" "}
                    {new Date(b.borrowed_at).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default MemberList;
