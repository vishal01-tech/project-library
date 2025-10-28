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
  const [filterMembers, setFilterMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch members
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

  // Fetch borrowed books
  const fetchBorrowed = async () => {
    try {
      const response = await api.get("/borrowed?limit=10000");
      const data = response.data;
      setBorrowed(data.data || []);
    } catch (error) {
      console.error("Failed to fetch borrowed books:", error);
    }
  };

  // Fetch books
  const fetchBooks = async () => {
    try {
      const response = await api.get("/books?limit=10000");
      const data = response.data;
      setBooks(data.data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchMembers(currentPage, searchQuery); // Trigger fetchMembers with currentPage and searchQuery
    }, 500); // 500ms debounce delay
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage]); // Triggered on searchQuery or currentPage change

  // Initial data fetch (members, borrowed books, books)
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchBorrowed(),
        fetchBooks(),
        fetchMembers(currentPage, searchQuery),
      ]);
      setLoading(false);
    };
    fetchData();
  }, []); // Empty dependency array to run only once when component mounts

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
                <th>S.No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Borrowed Books</th>
              </tr>
            </thead>
            <tbody>
              {membersWithBorrowed.length === 0 ? (
                <tr>
                  <td colSpan="6">No members have borrowed books</td>
                </tr>
              ) : (
                membersWithBorrowed.map((member, index) => (
                  <tr key={member.id}>
                    <td>{(currentPage - 1) * 10 + (index + 1)}</td>
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
              onPageChange={(page) => {
                setCurrentPage(page);
                fetchMembers(page, searchQuery);
              }}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MemberList;
