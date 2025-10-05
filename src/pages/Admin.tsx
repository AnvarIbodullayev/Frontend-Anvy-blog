import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import api from "@/utils/axios"
import { Trash } from "lucide-react";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface ForAllUsers {
  message: string;
  allUsers: []
}

function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await api.get<ForAllUsers>(`/user`);
        setUsers(res.data.allUsers)

        toast.success(res.data.message)
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong")
      }
    }

    fetchAllUsers()
  }, [])

  // sort by role
  const handleSortByRole = () => {
    const sorted = [...users].sort((a, b) =>
      sortAsc ? a.role.localeCompare(b.role) : b.role.localeCompare(a.role)
    );
    setUsers(sorted)
    setSortAsc(!sortAsc)
  }

  // delete user
  const handleDeleteUser = async (id: string) => {
    try {
      const res = await api.delete(`/user/${id}`, {})
      setUsers((prev) => prev.filter((user) => user.id !== id))

      toast.success(res.data.message)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  // handle Change Role
  const handleChangeRole = async (id: string, value: any) => {
    try {
      const res = await api.patch(`/user/${id}/changerole`, { userRole: value })

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, role: value } : user
        )
      )

      toast.success(res.data.message)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }


  return (
    <>
      {/* <div>Take controll all users</div> */}
      <Table className="w-full table-auto">
        <TableCaption>A list of all users in the database.</TableCaption>
        <TableHeader>
          <TableRow className="bg-blue-100 dark:bg-blue-700">
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>
              <Button variant={"ghost"} size={"sm"} onClick={handleSortByRole}>
                Role {sortAsc ? "↑" : "↓"}
              </Button>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {users.map((user, index) => (
            <TableRow key={user.id} className="text-left">
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                {user.email}
              </TableCell>
              <TableCell>
                {/* select USER | ADMIN*/}
                <Select
                  value={user.role}
                  onValueChange={(value) => handleChangeRole(user.id, value)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder={user.role} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>

              </TableCell>
              <TableCell>
                <Button onClick={() => handleDeleteUser(user.id)} variant={"ghost"} size={"icon"} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-500 cursor-pointer">
                  <Trash className="w-2 h-2" />
                </Button>
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </>
  )
}

export default Admin