import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { graphql, createFragmentContainer } from 'react-relay';
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid';
import inject18n from '../../../../components/i18n';
import CourseOfActionDetails from './CourseOfActionDetails';
import CourseOfActionEdition from './CourseOfActionEdition';
import CourseOfActionPopover from './CourseOfActionPopover';
import StixDomainObjectHeader from '../../common/stix_domain_objects/StixDomainObjectHeader';
import Security from '../../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../../utils/hooks/useGranted';
import StixCoreObjectOrStixCoreRelationshipNotes from '../../analyses/notes/StixCoreObjectOrStixCoreRelationshipNotes';
import StixDomainObjectOverview from '../../common/stix_domain_objects/StixDomainObjectOverview';
import StixCoreObjectExternalReferences from '../../analyses/external_references/StixCoreObjectExternalReferences';
import StixCoreObjectLatestHistory from '../../common/stix_core_objects/StixCoreObjectLatestHistory';
import SimpleStixObjectOrStixRelationshipStixCoreRelationships from '../../common/stix_core_relationships/SimpleStixObjectOrStixRelationshipStixCoreRelationships';
import StixCoreObjectOrStixRelationshipLastContainers from '../../common/containers/StixCoreObjectOrStixRelationshipLastContainers';

const styles = () => ({
  container: {
    margin: 0,
  },
  gridContainer: {
    marginBottom: 20,
  },
});

class CourseOfActionComponent extends Component {
  render() {
    const { classes, courseOfAction } = this.props;
    return (
      <div className={classes.container}>
        <StixDomainObjectHeader
          entityType={'Course-Of-Action'}
          stixDomainObject={courseOfAction}
          PopoverComponent={<CourseOfActionPopover />}
          isOpenctiAlias={true}
        />
        <Grid
          container={true}
          spacing={3}
          classes={{ container: classes.gridContainer }}
        >
          <Grid item={true} xs={6} style={{ paddingTop: 10 }}>
            <CourseOfActionDetails courseOfAction={courseOfAction} />
          </Grid>
          <Grid item={true} xs={6} style={{ paddingTop: 10 }}>
            <StixDomainObjectOverview stixDomainObject={courseOfAction} />
          </Grid>
          <Grid item={true} xs={6} style={{ marginTop: 30 }}>
            <SimpleStixObjectOrStixRelationshipStixCoreRelationships
              stixObjectOrStixRelationshipId={courseOfAction.id}
              stixObjectOrStixRelationshipLink={`/dashboard/techniques/courses_of_action/${courseOfAction.id}/knowledge`}
            />
          </Grid>
          <Grid item={true} xs={6} style={{ marginTop: 30 }}>
            <StixCoreObjectOrStixRelationshipLastContainers
              stixCoreObjectOrStixRelationshipId={courseOfAction.id}
            />
          </Grid>
          <Grid item={true} xs={6} style={{ marginTop: 30 }}>
            <StixCoreObjectExternalReferences
              stixCoreObjectId={courseOfAction.id}
            />
          </Grid>
          <Grid item={true} xs={6} style={{ marginTop: 30 }}>
            <StixCoreObjectLatestHistory stixCoreObjectId={courseOfAction.id} />
          </Grid>
        </Grid>
        <StixCoreObjectOrStixCoreRelationshipNotes
          stixCoreObjectOrStixCoreRelationshipId={courseOfAction.id}
          defaultMarkings={(courseOfAction.objectMarking?.edges ?? []).map(
            (edge) => edge.node,
          )}
        />
        <Security needs={[KNOWLEDGE_KNUPDATE]}>
          <CourseOfActionEdition courseOfActionId={courseOfAction.id} />
        </Security>
      </div>
    );
  }
}

CourseOfActionComponent.propTypes = {
  courseOfAction: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
};

const CourseOfAction = createFragmentContainer(CourseOfActionComponent, {
  courseOfAction: graphql`
    fragment CourseOfAction_courseOfAction on CourseOfAction {
      id
      standard_id
      entity_type
      x_opencti_stix_ids
      spec_version
      revoked
      confidence
      created
      modified
      created_at
      updated_at
      createdBy {
        ... on Identity {
          id
          name
          entity_type
        }
      }
      creators {
        id
        name
      }
      objectMarking {
        edges {
          node {
            id
            definition_type
            definition
            x_opencti_order
            x_opencti_color
          }
        }
      }
      objectLabel {
        edges {
          node {
            id
            value
            color
          }
        }
      }
      name
      x_opencti_aliases
      status {
        id
        order
        template {
          name
          color
        }
      }
      workflowEnabled
      ...CourseOfActionDetails_courseOfAction
    }
  `,
});

export default compose(inject18n, withStyles(styles))(CourseOfAction);
