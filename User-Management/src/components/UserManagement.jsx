import React, { useState, useEffect } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import {
  Container,
  Button,
  Dialog,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import UserTable from "./UserTable";
import UserForm from "./UserForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiURL } from "../services/api";

const departmentsList = [
  "Design",
  "Sales",
  "HR",
  "IT",
  "Finance",
  "Customer Support",
  "Legal",
  "Administration",
  "R&D",
  "Logistics",
  "Production",
  "Quality Assurance",
  "Engineering",
  "Marketing",
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/users`);
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users");
      toast.error("Failed to fetch users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (user) => {
    try {
      await axios.post(`${apiURL}/users`, user);
      fetchUsers();
      toast.success("User added successfully");
      setIsDialogOpen(false);
    } catch (err) {
      setError("Failed to add user");
      toast.error("Failed to add user");
    }
  };

  const handleEditUser = async (user) => {
    try {
      await axios.patch(`${apiURL}/users/${user.id}`, user);
      fetchUsers();
      setIsDialogOpen(false);
      toast.success("User updated successfully");
    } catch (err) {
      setError("Failed to edit user");
      toast.error("Failed to edit user");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${apiURL}/users/${id}`);
      fetchUsers();
      toast.success("User deleted successfully");
    } catch (err) {
      setError("Failed to delete user");
      toast.error("Failed to delete user");
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleOpenDialog = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setIsDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "" || user.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  return (
    <Container
  sx={{
    marginTop: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2, 
  }}
>
  
  <Button
    variant="contained"
    onClick={handleOpenDialog}
    sx={{
      backgroundColor: "#4358f6",
      borderRadius: 2,
      flexBasis: "100%", 
      "@media (min-width: 900px)": {
        flexBasis: "auto", 
      },
    }}
    startIcon={<AddIcon />}
  >
    Add User
  </Button>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      justifyContent: "flex-end", 
      width: "100%", 
      "@media (min-width: 900px)": {
        justifyContent: "flex-end", 
      },
    }}
  >
    
    <TextField
      label="Search by Name or Email"
      variant="outlined"
      value={searchTerm}
      onChange={handleSearchChange}
      sx={{
        minWidth: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 2,
        "@media (min-width: 900px)": {
          minWidth: 300, 
        },
      }}
    />

    
    <FormControl
      variant="outlined"
      sx={{
        minWidth: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 2,
        "@media (min-width: 900px)": {
          minWidth: 200, 
        },
      }}
    >
      <InputLabel>Filter by Department</InputLabel>
      <Select
        value={selectedDepartment}
        onChange={handleDepartmentChange}
        label="Filter by Department"
      >
        <MenuItem value="">All Departments</MenuItem>
        {departmentsList.map((dept, index) => (
          <MenuItem key={index} value={dept}>
            {dept}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </div>

  
  <UserTable
    users={filteredUsers.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    )}
    onEdit={handleSelectUser}
    onDelete={handleDeleteUser}
    loading={loading}
    page={page}
    rowsPerPage={rowsPerPage}
    totalUsers={filteredUsers.length}
    onChangePage={handleChangePage}
  />

 
  <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
    <UserForm
      onSave={selectedUser ? handleEditUser : handleAddUser}
      user={selectedUser}
      onCancel={handleCloseDialog}
    />
  </Dialog>

  <ToastContainer />
</Container>

  );
};

export default UserManagement;
