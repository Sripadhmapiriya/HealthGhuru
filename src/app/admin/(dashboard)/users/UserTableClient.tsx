/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Shield, ShieldCheck, MoreVertical, Edit2, Key, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { setUserRole } from '@/lib/admin/actions/setUserRole';
import { PillBadge } from '@/components/ui/PillBadge';
import { useToast } from '@/components/providers/ToastProvider';
import { useDialog } from '@/components/providers/DialogProvider';
import { IconButton } from '@/components/ui/IconAction';
import { manageUser } from '@/lib/admin/actions/manageUser';
import Link from 'next/link';

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  status: string;
};

const columnHelper = createColumnHelper<UserRow>();

export function UserTableClient({ initialUsers }: { initialUsers: UserRow[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const { confirm } = useDialog();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => <span className="font-medium text-[#1A2E1A]">{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => <span className="text-[#78909C]">{info.getValue()}</span>,
    }),
    columnHelper.accessor('plan', {
      header: 'Plan',
      cell: info => (
        <PillBadge active={info.getValue() === 'pro'} className="uppercase text-[10px]">
          {info.getValue()}
        </PillBadge>
      ),
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: info => (
        <PillBadge active={info.getValue() === 'admin'} className={info.getValue() === 'admin' ? 'bg-[#F9A825] text-white' : ''}>
          {info.getValue()}
        </PillBadge>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const isSuspended = info.getValue() === 'suspended';
        return (
          <PillBadge active={!isSuspended} className={isSuspended ? 'bg-red-100 text-red-800' : 'bg-[#EBF5EB] text-[#2E7D32]'}>
            {info.getValue().toUpperCase()}
          </PillBadge>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: props => {
        const user = props.row.original;
        const isSuspended = user.status === 'suspended';
        return (
          <div className="flex justify-end gap-1">
            <Link href={`/admin/users/${user.id}`} className="p-2 text-[#78909C] hover:bg-[#EBF5EB] rounded-md transition-colors" title="View Profile">
              <Search size={16} />
            </Link>
            <button onClick={() => handleRoleChangeRequest(user)} className="p-2 text-[#78909C] hover:bg-[#EBF5EB] rounded-md transition-colors" title="Change Role">
              <Shield size={16} />
            </button>
            <button onClick={() => handleManageUser(user, isSuspended ? 'activate' : 'suspend')} className="p-2 text-[#78909C] hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors" title={isSuspended ? 'Activate User' : 'Suspend User'}>
              <ShieldCheck size={16} className={isSuspended ? 'text-green-600' : ''} />
            </button>
            <button onClick={() => handleManageUser(user, 'delete')} className="p-2 text-[#78909C] hover:bg-red-50 hover:text-[#C62828] rounded-md transition-colors" title="Delete User">
              <MoreVertical size={16} className="hidden" /> {/* Keep import happy if needed */}
              <Edit2 size={16} className="hidden" />
              <Key size={16} className="hidden" />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
        );
      }
    })
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRoleChangeRequest = async (targetUser: UserRow) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const description = `You are about to change the role for ${targetUser.name} from ${targetUser.role} to ${newRole}. ${targetUser.role !== 'admin' ? 'This grants full administrative access to the platform.' : ''}`;
    
    const ok = await confirm({
      title: 'Change Role',
      description,
      confirmLabel: 'Confirm Change',
      variant: 'danger'
    });
    
    if (!ok) return;

    setIsUpdating(true);
    try {
      await setUserRole({ targetUserId: targetUser.id, newRole });
      
      // Update local state
      setUsers(users.map(u => u.id === targetUser.id ? { ...u, role: newRole } : u));
      toast.success('User role updated successfully');
    } catch (e: Error | unknown) {
      console.error('Failed to change role', e);
      toast.error(e instanceof Error ? e.message : 'Failed to change role.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleManageUser = async (targetUser: UserRow, action: 'suspend' | 'activate' | 'delete') => {
    const isDelete = action === 'delete';
    
    const ok = await confirm({
      title: isDelete ? 'Delete User' : `${action === 'suspend' ? 'Suspend' : 'Activate'} User`,
      description: isDelete 
        ? `Are you sure you want to permanently delete ${targetUser.name}? This will remove all their records, goals, and data.`
        : `Are you sure you want to ${action} the account for ${targetUser.name}?`,
      confirmLabel: isDelete ? 'Permanently Delete' : `Confirm ${action}`,
      variant: isDelete ? 'danger' : 'default'
    });
    
    if (!ok) return;

    setIsUpdating(true);
    try {
      await manageUser({ userId: targetUser.id, action });
      
      if (isDelete) {
        setUsers(users.filter(u => u.id !== targetUser.id));
        toast.success('User deleted permanently.');
      } else {
        const newStatus = action === 'suspend' ? 'suspended' : 'active';
        setUsers(users.map(u => u.id === targetUser.id ? { ...u, status: newStatus } : u));
        toast.success(`User successfully ${newStatus}.`);
      }
    } catch (e: Error | unknown) {
      console.error(`Failed to ${action} user`, e);
      toast.error(e instanceof Error ? e.message : `Failed to ${action} user.`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-[rgba(46,125,50,0.15)] bg-gray-50/50">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 text-sm font-semibold text-[#1A2E1A]">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-[rgba(46,125,50,0.15)] hover:bg-gray-50/50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
