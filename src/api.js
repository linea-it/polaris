import Lokka from 'lokka';
import Transport from 'lokka-transport-http';

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? window._env_.REACT_APP_API_URL
    : process.env.REACT_APP_API_URL;

const client = new Lokka({
  transport: new Transport(apiUrl),
});

export default class Centaurus {
  static async getAllProcessesList(
    sorting,
    pageSize,
    after,
    filter,
    searchValue
  ) {
    const sort = `${sorting[0].columnName}_${sorting[0].direction}`;
    var strAfter = '';
    var strFilter = '';

    if (after !== null) {
      strAfter = `, after: "${after}"`;
    }

    if (filter === 'all') {
      strFilter = 'allInstances: true';
    } else if (filter === 'running') {
      strFilter = 'running: true';
    }

    try {
      const processesList = await client.query(`
        {
          processesList(${strFilter}, search: {text: "${searchValue}", columns: [processes_process_id, processes_start_time, processes_end_time, processes_name, processes_instance, release_tag_release_display_name, fields_display_name, tg_user_display_name]}, sort: [${sort}], first: ${pageSize} ${strAfter}) {
            pageInfo {
                startCursor
                endCursor
            }
            totalCount
            edges {
              cursor
              node {
                processId
                startTime
                endTime
                name
                flagPublished
                instance
                savedProcesses {
                  savedDate
                  savedDateEnd
                }
                processStatus{
                  name
                }
                session {
                  user{
                    displayName
                  }
                }
                fields {
                  edges {
                    node {
                      displayName
                      releaseTag {
                        releaseDisplayName
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `);
      return processesList;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      return null;
    }
  }
}
