import React, { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';
import anime from 'animejs';
import { useToolbar } from '../composables/useToolbar';
import { useDataStore } from '../stores/dataStore';
import { useProfileStore } from '../stores/profileStore';
import { animateDashboard } from '../utils/AnimationUtils';
import UIUtils from '../utils/UIUtils';
import RouteConstants from '../constants/RouteConstants';
import { DASHBOARD_SECTIONS } from '../constants/DashboardConstants';
import TablerIconConstants from '../constants/TablerIconConstants';
import DashboardAccounts from '../components/dashboard/DashboardAccounts';
import DashboardWeekBars from '../components/dashboard/DashboardWeekBars';
import DashboardSummary from '../components/dashboard/DashboardSummary';
import DashboardBudgets from '../components/dashboard/DashboardBudgets';
import DashboardSummarySavings from '../components/dashboard/DashboardSummarySavings';
import DashboardTagTotals from '../components/dashboard/DashboardTagTotals';
import DashboardCategoryTotals from '../components/dashboard/DashboardCategoryTotals';
import DashboardTodoTransactions from '../components/dashboard/DashboardTodoTransactions';
import AppCardInfo from '../components/ui-kit/AppCardInfo';
import AppFieldLink from '../components/ui-kit/AppFieldLink';

const DashboardPage: React.FC = () => {
  const toolbar = useToolbar();
  const dataStore = useDataStore();
  const profileStore = useProfileStore();
  const router = useRouter();
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  useEffect(() => {
    toolbar.init({ title: 'Dashboard' });
    animateDashboard();

    if (dataStore.dashboard.transactionsListLastWeek.length > 0) {
      return;
    }
    onRefreshDebounce();
  }, []);

  const onRefresh = () => {
    dataStore.fetchAccounts();
    dataStore.fetchDashboardTransactionsForInterval();
    dataStore.fetchDashboardTransactionsForWeek();
    dataStore.fetchTransactionsWithTodos();
    dataStore.fetchExchangeRate();
    dataStore.fetchBudgets();
  };

  const onRefreshDebounce = debounce(onRefresh, 200);

  const isLoadingDashboard = () => {
    return dataStore.isLoadingAccounts || dataStore.isLoadingDashboardTransactions || dataStore.isLoadingDashboardTransactionsLastWeek;
  };

  const getStyleForCard = (fieldCode: string) => {
    let position = profileStore.dashboardOrderedCardsList.findIndex((item) => item.code === fieldCode);
    let field = profileStore.dashboardOrderedCardsList.find((item) => item.code === fieldCode);
    let isVisible = field ? field.isVisible : true;
    let displayStyle = isVisible ? '' : 'display: none';

    return `order: ${position}; ${displayStyle}`;
  };

  UIUtils.showLoadingWhen(isLoadingDashboard);

  return (
    <div className="app-form">
      <div className="flex-column display-flex">
        <DashboardAccounts style={getStyleForCard(DASHBOARD_SECTIONS.accounts)} />
        <DashboardWeekBars style={getStyleForCard(DASHBOARD_SECTIONS.expensesLastWeek)} />
        <DashboardSummary style={getStyleForCard(DASHBOARD_SECTIONS.transactionSummary)} />
        <DashboardBudgets style={getStyleForCard(DASHBOARD_SECTIONS.budgets)} />
        <DashboardSummarySavings style={getStyleForCard(DASHBOARD_SECTIONS.savings)} />
        <DashboardTagTotals style={getStyleForCard(DASHBOARD_SECTIONS.expensesByTag)} />
        <DashboardCategoryTotals style={getStyleForCard(DASHBOARD_SECTIONS.expensesByCategory)} />
        <DashboardTodoTransactions style={getStyleForCard(DASHBOARD_SECTIONS.todosTransactions)} />
        <AppCardInfo style={{ order: 99 }}>
          <AppFieldLink label="Configure cards" icon={TablerIconConstants.settings} onClick={() => router.push(RouteConstants.ROUTE_SETTINGS_DASHBOARD_CARDS_ORDER)} />
        </AppCardInfo>
      </div>
    </div>
  );
};

export default DashboardPage;
