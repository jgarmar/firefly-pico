import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { IconAdjustmentsAlt, IconFilter } from '@tabler/icons-react';
import TransactionListItem from '../../components/TransactionListItem';
import TransactionFilters from '../../components/TransactionFilters';
import EmptyList from '../../components/EmptyList';
import { fetchTransactions, fetchTags, fetchCategories, fetchBudgets, fetchAccounts } from '../../api';
import { Transaction, Tag, Account, Category, Budget } from '../../models';
import { DateUtils, isStringEmpty } from '../../utils';

const TransactionsListPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filters, setFilters] = useState<any>({});
  const [filtersDisplayList, setFiltersDisplayList] = useState<string[]>([]);
  const [filtersBackendList, setFiltersBackendList] = useState<string[]>([]);
  const transactionFiltersRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const transactionsData = await fetchTransactions();
      setTransactions(transactionsData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const onShowFilters = () => {
    if (transactionFiltersRef.current) {
      transactionFiltersRef.current.show();
    }
  };

  const onClearFilters = () => {
    setFilters({});
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    const transactionsData = await fetchTransactions();
    setTransactions(transactionsData);
    setIsRefreshing(false);
  };

  const onLoadMore = async () => {
    const transactionsData = await fetchTransactions();
    setTransactions((prevTransactions) => [...prevTransactions, ...transactionsData]);
  };

  useEffect(() => {
    const filtersDictionary = [
      {
        display: `Description: ${filters.description}`,
        filter: `description_contains:"${filters.description}"`,
        active: !isStringEmpty(filters.description),
      },
      {
        display: `Type: ${filters.transactionType?.name}`,
        filter: `type:"${filters.transactionType?.fireflyCode}"`,
        active: !!filters.transactionType,
      },
      {
        display: `Tag: ${Tag.getDisplayNameEllipsized(filters.tag)}`,
        filter: `tag_is:"${Tag.getDisplayNameEllipsized(filters.tag)}"`,
        active: !!filters.tag,
      },
      {
        display: `- Tag: ${Tag.getDisplayNameEllipsized(filters.excludedTag)}`,
        filter: `-tag_is:"${Tag.getDisplayNameEllipsized(filters.excludedTag)}"`,
        active: !!filters.excludedTag,
      },
      {
        display: `No tags`,
        filter: `has_any_tag:false"`,
        active: !!filters.withoutTag,
      },
      {
        display: `Category: ${Category.getDisplayName(filters.category)}`,
        filter: `category_is:"${Category.getDisplayName(filters.category)}"`,
        active: !!filters.category,
      },
      {
        display: `- Category: ${Category.getDisplayName(filters.excludedCategory)}`,
        filter: `-category_is:"${Category.getDisplayName(filters.excludedCategory)}"`,
        active: !!filters.excludedCategory,
      },
      {
        display: `No category`,
        filter: `has_any_category:false"`,
        active: !!filters.withoutCategory,
      },
      {
        display: `Budget: ${Budget.getDisplayName(filters.budget)}`,
        filter: `budget_is:"${Budget.getDisplayName(filters.budget)}"`,
        active: !!filters.budget,
      },
      {
        display: `No budget`,
        filter: `has_any_budget:false"`,
        active: !!filters.withoutBudget,
      },
      {
        display: `Account: ${Account.getDisplayName(filters.account)}`,
        filter: `account_is:"${Account.getDisplayName(filters.account)}"`,
        active: !!filters.account,
      },
      {
        display: `- Account: ${Account.getDisplayName(filters.excludedAccount)}`,
        filter: `-account_is:"${Account.getDisplayName(filters.excludedAccount)}"`,
        active: !!filters.excludedAccount,
      },
      {
        display: `Amount > ${filters.amountStart}`,
        filter: `more:"${filters.amountStart}"`,
        active: !!filters.amountStart,
      },
      {
        display: `Amount < ${filters.amountEnd}`,
        filter: `less:"${filters.amountEnd}"`,
        active: !!filters.amountEnd,
      },
      {
        display: `Date > ${DateUtils.dateToUI(filters.dateStart)}`,
        filter: `date_after:"${DateUtils.dateToString(filters.dateStart)}"`,
        active: !!filters.dateStart,
      },
      {
        display: `Date < ${DateUtils.dateToUI(filters.dateEnd)}`,
        filter: `date_before:"${DateUtils.dateToString(filters.dateEnd)}"`,
        active: !!filters.dateEnd,
      },
    ];

    setFiltersDisplayList(filtersDictionary.filter((item) => item.active).map((item) => item.display));
    setFiltersBackendList(filtersDictionary.filter((item) => item.active).map((item) => item.filter));
  }, [filters]);

  useEffect(() => {
    onRefresh();
  }, [filtersBackendList]);

  return (
    <div className="app-form">
      <div className="app-top-toolbar">
        <div className="right">
          <button onClick={onShowFilters} className="mr-10 no-border">
            <IconAdjustmentsAlt size={20} strokeWidth={1.9} />
          </button>
          <button onClick={() => router.push('/transactions/create')} className="no-border">
            Add
          </button>
        </div>
      </div>

      {filtersDisplayList.length > 0 && (
        <div className="applied-filters-container">
          <div className="flex-center-vertical">
            <div className="title flex-1">Applied filters</div>
            <button onClick={onClearFilters} className="">
              Clear
            </button>
          </div>

          <div className="display-flex flex-wrap gap-1">
            {filtersDisplayList.map((appliedFilter, index) => (
              <div key={index} className="app-tag van-tag van-tag--round van-tag--medium van-tag--primary">
                <IconFilter size={14} strokeWidth={1.9} />
                <span className="ml-5">{appliedFilter}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && <div>Loading...</div>}
      {!isLoading && transactions.length === 0 && <EmptyList />}

      <div className="van-pull-refresh" onRefresh={onRefresh}>
        <div className="van-list p-1" onLoad={onLoadMore}>
          {transactions.map((transaction) => (
            <TransactionListItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>

      <TransactionFilters ref={transactionFiltersRef} filters={filters} setFilters={setFilters} />
    </div>
  );
};

export default TransactionsListPage;
