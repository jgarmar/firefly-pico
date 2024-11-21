import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useAccounts } from '../../hooks/useAccounts';
import { useRouter } from 'next/router';

const AccountsList: React.FC = () => {
  const { data: accounts, isLoading, isError, refetch } = useAccounts();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleAdd = () => {
    router.push('/accounts/new');
  };

  const handleEdit = (id: string) => {
    router.push(`/accounts/${id}`);
  };

  const handleDelete = (id: string) => {
    // Implement delete functionality
  };

  const filteredAccounts = accounts?.filter((account) =>
    account.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading accounts</div>;
  }

  return (
    <div className="app-form">
      <div className="app-top-toolbar">
        <button onClick={handleAdd}>Add Account</button>
      </div>

      {filteredAccounts?.length === 0 ? (
        <div>No accounts found</div>
      ) : (
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search accounts"
          />
          <div>
            {filteredAccounts?.map((account) => (
              <div key={account.id}>
                <span>{account.name}</span>
                <button onClick={() => handleEdit(account.id)}>Edit</button>
                <button onClick={() => handleDelete(account.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsList;
