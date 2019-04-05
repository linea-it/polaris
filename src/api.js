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
  static async getAllProcessesListTotalCount(filter) {
    var strFilter = '';

    if (filter === 'all') {
      strFilter = "allInstances: true";
    } else if (filter === 'running') {
      strFilter = "running: true";
    }

    try {
      const processesList = await client.query(`
        {
          processesList( ${strFilter} ) {                    
            pageInfo {
              startCursor
              endCursor
            }
          }
        }
      `);
      return processesList;
    } catch (e) {
      return null;
    }
  }

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
    var search = [];
    if (after !== null) {
      strAfter = `, after: "${after}"`;
    }

    if (searchValue.length > 1) {
      search = `, search: "${searchValue}"`;
    }

    if (filter === 'all') {
      strFilter = "allInstances: true";
    } else if (filter === 'running') {
      strFilter = "running: true";
    }

    try {
      const processesList = await client.query(`
        {
            processesList(${strFilter}, sort: [${sort}], first: ${pageSize} ${strAfter} ${search}) {
                pageInfo {
                    startCursor
                    endCursor
                }
                edges {
                    cursor
                    node {
                        processId
                        startTime
                        endTime
                        name
                        instance
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
                                    fieldName
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
      return null;
    }
  }
}
