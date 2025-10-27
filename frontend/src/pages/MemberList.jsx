import { useState, useEffect } from "react";
import NavbarSidebar from "../components/NavbarSidebar";
import Pagination from "../components/Pagination";
import "../assets/styles/MemberList.css";
import api from "../api/api";
import Footer from "../components/Footer";

function MemberList() {
  const [members, setMembers] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMembers, setfilterMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMembers = async (page = 1, search = searchQuery) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (search) {
        params.append("search", search);
      }
      const response = await api.get(`/members?${params.toString()}`);
      const data = response.data;
      setMembers(data.data);
      setTotalPages(Math.ceil(data.total / 10));
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  const fetchBorrowed = async () => {
    try {
      const response = await api.get("/borrowed");
      const data = response.data;
      setBorrowed(data.data || []);
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
    // Refetch members when search query changes
    fetchMembers(1, searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchBorrowed(), fetchBooks()]);
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

  const membersWithBorrowed = members.filter(
    (member) => memberBorrowedMap[member.id]
  );

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
                  <td colSpan="5">No members have borrowed books</td>
                </tr>
              ) : (
                membersWithBorrowed.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{member.address}</td>
                    <td>
                      <ul>
                        {memberBorrowedMap[member.id].map((borrow) => (
                          <li key={borrow.id}>
                            {borrow.book.title} by {borrow.book.author}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={fetchMembers}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MemberList;
