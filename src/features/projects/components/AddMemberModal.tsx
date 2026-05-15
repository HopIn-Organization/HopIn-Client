import { FormEvent, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/ui/Modal";
import { Button } from "@/ui/Button";
import { Select } from "@/ui/Select";
import { Job } from "@/types/job";
import { User } from "@/types/user";
import { ProjectMemberRoles } from "@/types/projectMember";
import { apiClient } from "@/services/http/api-client";
import { useClickOutside } from "@/hooks/useClickOutside";

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { memberId: string; jobId: string; role: string }) => void;
  jobs: Job[];
  isPending?: boolean;
}

export function AddMemberModal({ open, onClose, onSubmit, jobs, isPending }: AddMemberModalProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [jobId, setJobId] = useState("");
  const [role, setRole] = useState<string>(ProjectMemberRoles.TRAINEE);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setShowDropdown(false));

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await apiClient.get<User[]>("/users");
      return data;
    },
    enabled: open,
  });

  const filteredUsers = useMemo(() => {
    if (!searchValue.trim()) return users;
    const query = searchValue.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().startsWith(query) ||
        (user.email && user.email.toLowerCase().startsWith(query)),
    );
  }, [users, searchValue]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedUser || !jobId) return;
    onSubmit({ memberId: String(selectedUser.id), jobId, role });
  }

  function handleSelectUser(user: User) {
    setSelectedUser(user);
    setSearchValue(user.name);
    setShowDropdown(false);
  }

  function handleClose() {
    setSearchValue("");
    setSelectedUser(null);
    setJobId("");
    setRole(ProjectMemberRoles.TRAINEE);
    setShowDropdown(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Member" subtitle="Find your new employee">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="relative" ref={dropdownRef}>
          <label className="block space-y-2 text-sm">
            <span className="text-sm font-medium text-text-secondary">User</span>
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setSelectedUser(null);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search by name or email..."
                className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary"
              />
            </div>
          </label>

          {showDropdown && filteredUsers.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-border bg-surface shadow-soft">
              {filteredUsers.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    className="flex w-full flex-col px-4 py-2 text-left transition hover:bg-surface-muted"
                  >
                    <span className="text-sm font-medium text-text-primary">{user.name}</span>
                    {user.email && (
                      <span className="text-xs text-text-secondary">{user.email}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {showDropdown && searchValue && filteredUsers.length === 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-secondary shadow-soft">
              No users found
            </div>
          )}
        </div>

        <Select
          id="jobId"
          label="Job"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a job
          </option>
          {jobs.map((job) => (
            <option key={job.id} value={String(job.id)}>
              {job.title}
            </option>
          ))}
        </Select>

        <Select
          id="role"
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value={ProjectMemberRoles.TRAINEE}>Trainee</option>
          <option value={ProjectMemberRoles.ADMIN}>Admin</option>
        </Select>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !selectedUser}>
            {isPending ? "Adding..." : "Add Member"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
