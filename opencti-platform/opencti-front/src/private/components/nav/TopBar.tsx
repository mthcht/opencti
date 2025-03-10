import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Badge } from '@mui/material';
import { Link, useLocation } from 'react-router-dom-v5-compat';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import {
  AccountCircleOutlined,
  ContentPasteSearchOutlined,
  ExploreOutlined,
  InsertChartOutlined,
  NotificationsOutlined,
} from '@mui/icons-material';
import { DatabaseCogOutline } from 'mdi-material-ui';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import {
  graphql,
  usePreloadedQuery,
  useSubscription,
  PreloadedQuery,
} from 'react-relay';
import { useTheme } from '@mui/styles';
import makeStyles from '@mui/styles/makeStyles';
import { GraphQLSubscriptionConfig } from 'relay-runtime';
import { useFormatter } from '../../../components/i18n';
import SearchInput from '../../../components/SearchInput';
import TopMenuDashboard from './TopMenuDashboard';
import TopMenuSearch from './TopMenuSearch';
import TopMenuAnalyses from './TopMenuAnalyses';
import TopMenuReport from './TopMenuReport';
import TopMenuNote from './TopMenuNote';
import TopMenuOpinion from './TopMenuOpinion';
import TopMenuGrouping from './TopMenuGrouping';
import TopMenuExternalReference from './TopMenuExternalReference';
import TopMenuEvents from './TopMenuEvents';
import TopMenuIncident from './TopMenuIncident';
import TopMenuObservedData from './TopMenuObservedData';
import TopMenuObservations from './TopMenuObservations';
import TopMenuIndicator from './TopMenuIndicator';
import TopMenuInfrastructure from './TopMenuInfrastructure';
import TopMenuStixCyberObservable from './TopMenuStixCyberObservable';
import TopMenuArtifact from './TopMenuArtifact';
import TopMenuThreats from './TopMenuThreats';
import TopMenuThreatActorGroup from './TopMenuThreatActorGroup';
import TopMenuIntrusionSet from './TopMenuIntrusionSet';
import TopMenuCampaign from './TopMenuCampaign';
import TopMenuArsenal from './TopMenuArsenal';
import TopMenuMalware from './TopMenuMalware';
import TopMenuTool from './TopMenuTool';
import TopMenuAttackPattern from './TopMenuAttackPattern';
import TopMenuVulnerability from './TopMenuVulnerability';
import TopMenuEntities from './TopMenuEntities';
import TopMenuSector from './TopMenuSector';
import TopMenuSystem from './TopMenuSystem';
import TopMenuOrganization from './TopMenuOrganization';
import TopMenuIndividual from './TopMenuIndividual';
import TopMenuRegion from './TopMenuRegion';
import TopMenuCountry from './TopMenuCountry';
import TopMenuAdministrativeArea from './TopMenuAdministrativeArea';
import TopMenuCity from './TopMenuCity';
import TopMenuPosition from './TopMenuPosition';
import TopMenuData from './TopMenuData';
import TopMenuSettings from './TopMenuSettings';
import TopMenuTechniques from './TopMenuTechniques';
import { commitMutation, MESSAGING$ } from '../../../relay/environment';
import Security from '../../../utils/Security';
import TopMenuCourseOfAction from './TopMenuCourseOfAction';
import TopMenuWorkspacesDashboards from './TopMenuWorkspacesDashboards';
import TopMenuWorkspacesInvestigations from './TopMenuWorkspacesInvestigations';
import Filters from '../common/lists/Filters';
import TopMenuChannel from './TopMenuChannel';
import TopMenuNarrative from './TopMenuNarrative';
import TopMenuEvent from './TopMenuEvent';
import TopMenuImport from './TopMenuImport';
import TopMenuLocation from './TopMenuLocation';
import TopMenuDataComponent from './TopMenuDataComponent';
import TopMenuDataSource from './TopMenuDataSource';
import TopMenuCaseIncident from './TopMenuCaseIncident';
import TopMenuCaseFeedback from './TopMenuCaseFeedback';
import FeedbackCreation from '../cases/feedbacks/FeedbackCreation';
import TopMenuCases from './TopMenuCases';
import TopMenuMalwareAnalysis from './TopMenuMalwareAnalysis';
import { Theme } from '../../../components/Theme';
import {
  EXPLORE,
  KNOWLEDGE,
  KNOWLEDGE_KNASKIMPORT,
} from '../../../utils/hooks/useGranted';
import TopMenuProfile from '../profile/TopMenuProfile';
import TopMenuNotifications from '../profile/TopMenuNotifications';
import { TopBarQuery } from './__generated__/TopBarQuery.graphql';
import {
  TopBarNotificationNumberSubscription,
  TopBarNotificationNumberSubscription$data,
} from './__generated__/TopBarNotificationNumberSubscription.graphql';
import TopMenuCaseRfi from './TopMenuCaseRfi';
import TopMenuCaseRft from './TopMenuCaseRft';
import TopMenuTask from './TopMenuTask';
import TopMenuAudits from './TopMenuAudits';
import useAuth from '../../../utils/hooks/useAuth';
import TopMenuThreatActorIndividual from './TopMenuThreatActorIndividual';
import { useSettingsMessagesBannerHeight } from '../settings/settings_messages/SettingsMessagesBanner';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';

const useStyles = makeStyles<Theme>((theme) => ({
  appBar: {
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
    background: 0,
    backgroundColor: theme.palette.background.nav,
    paddingTop: theme.spacing(0.2),
  },
  flex: {
    flexGrow: 1,
  },
  logoContainer: {
    margin: '2px 0 0 -10px',
  },
  logo: {
    cursor: 'pointer',
    height: 35,
  },
  logoCollapsed: {
    cursor: 'pointer',
    height: 35,
    marginRight: 10,
  },
  menuContainer: {
    float: 'left',
    marginLeft: 30,
  },
  barRight: {
    position: 'absolute',
    top: 0,
    right: 13,
    height: '100%',
  },
  barRightContainer: {
    float: 'left',
    height: '100%',
    paddingTop: 12,
  },
  divider: {
    display: 'table-cell',
    height: '100%',
    float: 'left',
    margin: '0 5px 0 5px',
  },
}));

const logoutMutation = graphql`
  mutation TopBarLogoutMutation {
    logout
  }
`;

export const handleLogout = (redirect = '') => {
  function redirectWindow() {
    if (redirect === '' || redirect.length === undefined) window.location.reload();
    else window.location.replace(redirect);
  }
  commitMutation({
    mutation: logoutMutation,
    variables: {},
    onCompleted: redirectWindow,
    updater: undefined,
    optimisticUpdater: undefined,
    optimisticResponse: undefined,
    onError: redirectWindow,
    setSubmitting: undefined,
  });
};

const topBarNotificationNumberSubscription = graphql`
  subscription TopBarNotificationNumberSubscription {
    notificationsNumber {
      count
    }
  }
`;

interface TopBarProps {
  keyword?: string;
  queryRef: PreloadedQuery<TopBarQuery>;
}

const topBarQuery = graphql`
  query TopBarQuery {
    myUnreadNotificationsCount
  }
`;

const TopBarComponent: FunctionComponent<TopBarProps> = ({
  queryRef,
  keyword,
}) => {
  const theme = useTheme<Theme>();
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const { t } = useFormatter();
  const {
    bannerSettings: { bannerHeightNumber },
  } = useAuth();
  const settingsMessagesBannerHeight = useSettingsMessagesBannerHeight();
  const [notificationsNumber, setNotificationsNumber] = useState<null | number>(
    null,
  );
  const data = usePreloadedQuery(topBarQuery, queryRef);
  const handleNewNotificationsNumber = (
    response: TopBarNotificationNumberSubscription$data | null | undefined,
  ) => {
    return setNotificationsNumber(response?.notificationsNumber?.count ?? null);
  };
  const isNewNotification = notificationsNumber !== null
    ? notificationsNumber > 0
    : (data.myUnreadNotificationsCount ?? 0) > 0;
  const subConfig = useMemo<
  GraphQLSubscriptionConfig<TopBarNotificationNumberSubscription>
  >(
    () => ({
      subscription: topBarNotificationNumberSubscription,
      variables: {},
      onNext: handleNewNotificationsNumber,
    }),
    [topBarNotificationNumberSubscription],
  );
  useSubscription(subConfig);
  const [navOpen, setNavOpen] = useState(
    localStorage.getItem('navOpen') === 'true',
  );
  useEffect(() => {
    const sub = MESSAGING$.toggleNav.subscribe({
      next: () => setNavOpen(localStorage.getItem('navOpen') === 'true'),
    });
    return () => {
      sub.unsubscribe();
    };
  });
  const [menuOpen, setMenuOpen] = useState<{
    open: boolean;
    anchorEl: HTMLButtonElement | null;
  }>({ open: false, anchorEl: null });
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setMenuOpen({ open: true, anchorEl: event.currentTarget });
  };
  const handleCloseMenu = () => {
    setMenuOpen({ open: false, anchorEl: null });
  };
  const handleSearch = (searchKeyword: string) => {
    if (searchKeyword.length > 0) {
      // With need to double encode because of react router.
      // Waiting for history 5.0 integrated to react router.
      const encodeKey = encodeURIComponent(encodeURIComponent(searchKeyword));
      history.push(`/dashboard/search/${encodeKey}`);
    }
  };
  const handleOpenDrawer = () => {
    setOpenDrawer(true);
    handleCloseMenu();
  };
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    handleCloseMenu();
  };

  return (
    <AppBar
      position="fixed"
      className={classes.appBar}
      variant="elevation"
      elevation={1}
    >
      {/* Header and Footer Banners containing classification level of system */}
      <Toolbar
        style={{ marginTop: bannerHeightNumber + settingsMessagesBannerHeight }}
      >
        <div className={classes.logoContainer}>
          <Link to="/dashboard">
            <img
              src={navOpen ? theme.logo : theme.logo_collapsed}
              alt="logo"
              className={navOpen ? classes.logo : classes.logoCollapsed}
            />
          </Link>
        </div>
        <div className={classes.menuContainer}>
          {location.pathname === '/dashboard' && <TopMenuDashboard />}
          {location.pathname.includes('/dashboard/search') && <TopMenuSearch />}
          {location.pathname.includes('/dashboard/import') && <TopMenuImport />}
          {(location.pathname === '/dashboard/analyses'
            || location.pathname.match('/dashboard/analyses/[a-z_]+$')) && (
            <TopMenuAnalyses />
          )}
          {location.pathname === '/dashboard/profile/me' && <TopMenuProfile />}
          {location.pathname !== '/dashboard/profile/me'
            && location.pathname.includes('/dashboard/profile/') && (
              <TopMenuNotifications />
          )}
          {(location.pathname === '/dashboard/cases'
            || location.pathname.match('/dashboard/cases/[a-z_]+$')) && (
            <TopMenuCases />
          )}
          {location.pathname.includes('/dashboard/cases/incidents/') && (
            <TopMenuCaseIncident />
          )}
          {location.pathname.includes('/dashboard/cases/rfis/') && (
            <TopMenuCaseRfi />
          )}
          {location.pathname.includes('/dashboard/cases/rfts/') && (
            <TopMenuCaseRft />
          )}
          {location.pathname.includes('/dashboard/cases/tasks/') && (
            <TopMenuTask />
          )}
          {location.pathname.includes('/dashboard/cases/feedbacks/') && (
            <TopMenuCaseFeedback />
          )}
          {location.pathname.includes('/dashboard/analyses/reports/') && (
            <TopMenuReport />
          )}
          {location.pathname.includes('/dashboard/analyses/groupings/') && (
            <TopMenuGrouping />
          )}
          {location.pathname.includes(
            '/dashboard/analyses/malware_analyses/',
          ) && <TopMenuMalwareAnalysis />}
          {location.pathname.includes('/dashboard/analyses/notes/') && (
            <TopMenuNote />
          )}
          {location.pathname.includes('/dashboard/analyses/opinions/') && (
            <TopMenuOpinion />
          )}
          {location.pathname.includes(
            '/dashboard/analyses/external_references/',
          ) && <TopMenuExternalReference />}
          {(location.pathname === '/dashboard/events'
            || location.pathname.match('/dashboard/events/[a-z_]+$')) && (
            <TopMenuEvents />
          )}
          {location.pathname.includes('/dashboard/events/incidents/') && (
            <TopMenuIncident />
          )}
          {location.pathname.includes('/dashboard/events/observed_data/') && (
            <TopMenuObservedData />
          )}
          {location.pathname.includes('/dashboard/events/sightings/') && (
            <TopMenuEvents />
          )}
          {(location.pathname === '/dashboard/observations'
            || location.pathname.match('/dashboard/observations/[a-z_]+$')) && (
            <TopMenuObservations />
          )}
          {location.pathname.includes(
            '/dashboard/observations/indicators/',
          ) && <TopMenuIndicator />}
          {location.pathname.includes(
            '/dashboard/observations/infrastructures/',
          ) && <TopMenuInfrastructure />}
          {location.pathname.includes(
            '/dashboard/observations/observables/',
          ) && <TopMenuStixCyberObservable />}
          {location.pathname.includes('/dashboard/observations/artifacts/') && (
            <TopMenuArtifact />
          )}
          {(location.pathname === '/dashboard/threats'
            || location.pathname.match('/dashboard/threats/[a-z_]+$')) && (
            <TopMenuThreats />
          )}
          {location.pathname.includes(
            '/dashboard/threats/threat_actors_group/',
          ) && <TopMenuThreatActorGroup />}
          {location.pathname.includes(
            '/dashboard/threats/threat_actors_individual/',
          ) && <TopMenuThreatActorIndividual />}
          {location.pathname.includes('/dashboard/threats/intrusion_sets/') && (
            <TopMenuIntrusionSet />
          )}
          {location.pathname.includes('/dashboard/threats/campaigns/') && (
            <TopMenuCampaign />
          )}
          {(location.pathname === '/dashboard/arsenal'
            || location.pathname.match('/dashboard/arsenal/[a-z_]+$')) && (
            <TopMenuArsenal />
          )}
          {location.pathname.includes('/dashboard/arsenal/malwares/') && (
            <TopMenuMalware />
          )}
          {location.pathname.includes('/dashboard/arsenal/tools/') && (
            <TopMenuTool />
          )}
          {location.pathname.includes('/dashboard/arsenal/channels/') && (
            <TopMenuChannel />
          )}
          {location.pathname.includes(
            '/dashboard/arsenal/vulnerabilities/',
          ) && <TopMenuVulnerability />}
          {(location.pathname === '/dashboard/entities'
            || location.pathname.match('/dashboard/entities/[a-z_]+$')) && (
            <TopMenuEntities />
          )}
          {location.pathname.includes('/dashboard/entities/sectors/') && (
            <TopMenuSector />
          )}
          {location.pathname.includes('/dashboard/entities/systems/') && (
            <TopMenuSystem />
          )}
          {location.pathname.includes('/dashboard/entities/events/') && (
            <TopMenuEvent />
          )}
          {location.pathname.includes('/dashboard/entities/organizations/') && (
            <TopMenuOrganization />
          )}
          {location.pathname.includes('/dashboard/entities/individuals/') && (
            <TopMenuIndividual />
          )}
          {(location.pathname === '/dashboard/locations'
            || location.pathname.match('/dashboard/locations/[a-z_]+$')) && (
            <TopMenuLocation />
          )}
          {location.pathname.includes('/dashboard/locations/countries/') && (
            <TopMenuCountry />
          )}
          {location.pathname.includes('/dashboard/locations/regions/') && (
            <TopMenuRegion />
          )}
          {location.pathname.includes(
            '/dashboard/locations/administrative_areas/',
          ) && <TopMenuAdministrativeArea />}
          {location.pathname.includes('/dashboard/locations/cities/') && (
            <TopMenuCity />
          )}
          {location.pathname.includes('/dashboard/locations/positions/') && (
            <TopMenuPosition />
          )}
          {(location.pathname === '/dashboard/techniques'
            || location.pathname.match('/dashboard/techniques/[a-z_]+$')) && (
            <TopMenuTechniques />
          )}
          {location.pathname.includes(
            '/dashboard/techniques/attack_patterns/',
          ) && <TopMenuAttackPattern />}
          {location.pathname.includes('/dashboard/techniques/narratives/') && (
            <TopMenuNarrative />
          )}
          {location.pathname.includes(
            '/dashboard/techniques/courses_of_action/',
          ) && <TopMenuCourseOfAction />}
          {location.pathname.includes(
            '/dashboard/techniques/data_components/',
          ) && <TopMenuDataComponent />}
          {location.pathname.includes(
            '/dashboard/techniques/data_sources/',
          ) && <TopMenuDataSource />}
          {location.pathname.includes('/dashboard/data') ? <TopMenuData /> : ''}
          {location.pathname.includes('/dashboard/activity') && (
            <TopMenuAudits />
          )}
          {location.pathname.includes('/dashboard/settings') && (
            <TopMenuSettings />
          )}
          {location.pathname.includes('/dashboard/workspaces/dashboards') && (
            <TopMenuWorkspacesDashboards />
          )}
          {location.pathname.includes(
            '/dashboard/workspaces/investigations',
          ) && <TopMenuWorkspacesInvestigations />}
          {location.pathname === '/dashboard/profile' ? <TopMenuProfile /> : ''}
        </div>
        <div className={classes.barRight}>
          <Security needs={[KNOWLEDGE]}>
            <React.Fragment>
              <div className={classes.barRightContainer}>
                <SearchInput
                  onSubmit={handleSearch}
                  keyword={keyword}
                  variant="topBar"
                />
                <Filters
                  variant="dialog"
                  availableFilterKeys={[
                    'entity_type',
                    'markedBy',
                    'labelledBy',
                    'createdBy',
                    'confidence',
                    'x_opencti_organization_type',
                    'created_start_date',
                    'created_end_date',
                    'created_at_start_date',
                    'created_at_end_date',
                    'creator',
                  ]}
                  disabled={location.pathname.includes('/dashboard/search/')}
                  size={undefined}
                  fontSize={undefined}
                  noDirectFilters={undefined}
                  availableEntityTypes={undefined}
                  availableRelationshipTypes={undefined}
                  allEntityTypes={undefined}
                  handleAddFilter={undefined}
                  handleRemoveFilter={undefined}
                  handleSwitchFilter={undefined}
                  type={undefined}
                  availableRelationFilterTypes={undefined}
                />
                <Tooltip title={t('Bulk search')}>
                  <IconButton
                    component={Link}
                    to="/dashboard/search_bulk"
                    color={
                      location.pathname.includes('/dashboard/search_bulk')
                        ? 'secondary'
                        : 'default'
                    }
                    size="medium"
                  >
                    <ContentPasteSearchOutlined fontSize="medium" />
                  </IconButton>
                </Tooltip>
              </div>
              <Divider className={classes.divider} orientation="vertical" />
            </React.Fragment>
          </Security>
          <div className={classes.barRightContainer}>
            <Security needs={[EXPLORE]}>
              <React.Fragment>
                <Tooltip title={t('Custom dashboards')}>
                  <IconButton
                    component={Link}
                    to="/dashboard/workspaces/dashboards"
                    color={
                      location.pathname.includes(
                        '/dashboard/workspaces/dashboards',
                      )
                        ? 'secondary'
                        : 'default'
                    }
                    size="medium"
                  >
                    <InsertChartOutlined fontSize="medium" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('Investigations')}>
                  <IconButton
                    component={Link}
                    to="/dashboard/workspaces/investigations"
                    color={
                      location.pathname.includes(
                        '/dashboard/workspaces/investigations',
                      )
                        ? 'secondary'
                        : 'default'
                    }
                    size="medium"
                  >
                    <ExploreOutlined fontSize="medium" />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            </Security>
            <Security needs={[KNOWLEDGE_KNASKIMPORT]}>
              <Tooltip title={t('Data import and analyst workbenches')}>
                <IconButton
                  component={Link}
                  to="/dashboard/import"
                  color={
                    location.pathname.includes('/dashboard/import')
                      ? 'secondary'
                      : 'default'
                  }
                  size="medium"
                >
                  <DatabaseCogOutline fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Security>
            <Security needs={[KNOWLEDGE]}>
              <Tooltip title={t('Notifications and triggers')}>
                <IconButton
                  size="medium"
                  classes={{ root: classes.button }}
                  aria-haspopup="true"
                  component={Link}
                  to="/dashboard/profile/notifications"
                  color={
                    location.pathname === '/dashboard/profile/notifications'
                      ? 'secondary'
                      : 'default'
                  }
                >
                  <Badge
                    color="warning"
                    variant="dot"
                    invisible={!isNewNotification}
                  >
                    <NotificationsOutlined fontSize="medium" />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Security>
            <IconButton
              size="medium"
              classes={{ root: classes.button }}
              aria-owns={menuOpen.open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              id="profile-menu-button"
              onClick={handleOpenMenu}
              color={
                location.pathname === '/dashboard/profile/me'
                  ? 'secondary'
                  : 'default'
              }
            >
              <AccountCircleOutlined fontSize="medium" />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={menuOpen.anchorEl}
              open={menuOpen.open}
              onClose={handleCloseMenu}
            >
              <MenuItem
                component={Link}
                to="/dashboard/profile"
                onClick={handleCloseMenu}
              >
                {t('Profile')}
              </MenuItem>
              <MenuItem onClick={handleOpenDrawer}>{t('Feedback')}</MenuItem>
              <MenuItem id="logout-button" onClick={() => handleLogout()}>
                {t('Logout')}
              </MenuItem>
            </Menu>
          </div>
        </div>
      </Toolbar>
      <FeedbackCreation
        openDrawer={openDrawer}
        handleCloseDrawer={handleCloseDrawer}
      />
    </AppBar>
  );
};

const TopBar: FunctionComponent<TopBarProps> = ({ keyword }) => {
  const queryRef = useQueryLoading<TopBarQuery>(topBarQuery, {});
  const classes = useStyles();
  return (
    <>
      {queryRef && (
        <React.Suspense
          fallback={
            <AppBar
              position="fixed"
              className={classes.appBar}
              variant="elevation"
              elevation={1}
            />
          }
        >
          <TopBarComponent queryRef={queryRef} keyword={keyword} />
        </React.Suspense>
      )}
    </>
  );
};

export default TopBar;
