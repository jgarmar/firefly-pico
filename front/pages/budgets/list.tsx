import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useBudgets } from '../../hooks/useBudgets';
import { useRouter } from 'next/router';

const BudgetsList: React.FC = () => {
  const { data: budgets, isLoading, isError, refetch } = useBudgets();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleAdd = () => {
    router.push('/budgets/new');
  };

  const handleEdit = (id: string) => {
    router.push(`/budgets/${id}`);
  };

  const handleDelete = (id: string) => {
    // Implement delete functionality
  };

  const filteredBudgets = budgets?.filter((budget) =>
    budget.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading budgets</div>;
  }

  return (
    <div className="app-form">
      <div className="app-top-toolbar">
        <button onClick={handleAdd}>Add Budget</button>
      </div>

      {filteredBudgets?.length === 0 ? (
        <div>No budgets found</div>
      ) : (
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search budgets"
          />
          <div>
            {filteredBudgets?.map((budget) => (
              <div key={budget.id}>
                <span>{budget.name}</span>
                <button onClick={() => handleEdit(budget.id)}>Edit</button>
                <button onClick={() => handleDelete(budget.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetsList;
