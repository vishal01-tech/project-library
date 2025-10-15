import { useState, useEffect } from "react";
import NavbarSidebar from "../components/NavbarSidebar";
import "../assets/styles/MemberList.css";
import api from "../api/api";

function MemberList() {
  const [members, setMembers] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMembers, setfilterMembers] = useState([]);
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
    // filter members by name
    if (searchQuery.trim() === "") {
      setfilterMembers(members);
    } else {
      const filtered = members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setfilterMembers(filtered);
    }
  }, [members,searchQuery])

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchMembers(), fetchBorrowed(), fetchBooks()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Process data to map members to their borrowed books
  const memberBorrowedMap = {};
  borrowed.forEach((borrow) => {
    if (!memberBorrowedMap[borrow.member_id]) {
      memberBorrowedMap[borrow.member_id] = [];
    }
    const book = books.find((book) => book.id === borrow.book_id);
    if (book) {
      memberBorrowedMap[borrow.member_id].push({ ...borrow, book });
    }
  });

  const membersWithBorrowed = filterMembers.filter((member) => memberBorrowedMap[member.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavbarSidebar />
      <div className="main">
        <div className="member-list">
          <h3>Members with Borrowed Books</h3>
          <input
            type="text"
            placeholder="Search member by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Borrowed Books</th>
              </tr>
            </thead>
            <tbody>
              {membersWithBorrowed.length == 0 ? (
                <tr>
                  <td colSpan="4">No members have borrowed books</td>
                </tr>
              ) : (
                membersWithBorrowed.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{member.address}</td>
                    <td>
                      {memberBorrowedMap[member.id].map((borrow) => (
                        <tr key={borrow.id}>
                          <li>
                            {borrow.book.title} by {borrow.book.author}
                          </li>
                        </tr>
                      ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default MemberList;
