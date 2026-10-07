// Backslashes in the regex arguments are doubled on purpose: they sit inside JS strings.
export default {
  build: {
    preset: 'astro',
    polyfills: true
  },
  storage: [
    {
      name: 'docs-prod',
      prefix: '20261005193619',
      dir: './dist',
      workloadsAccess: 'read_only'
    }
  ],
  connectors: [
    {
      name: 'docs-prod',
      active: true,
      type: 'storage',
      attributes: {
        bucket: 'docs-prod',
        prefix: '20261005193619'
      }
    }
  ],
  applications: [
    {
      name: 'docs-prod',
      cache: [
        {
          name: 'docs-prod',
          browser: {
            maxAgeSeconds: 7200
          },
          edge: {
            maxAgeSeconds: 7200
          }
        }
      ],
      rules: {
        request: [
          {
            name: 'Deliver Static Assets and Set Cache Policy',
            description:
              'Deliver static assets directly from storage and set cache policy',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument:
                    '\\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|ttf|otf|woff|woff2|eot|pdf|doc|docx|xls|xlsx|ppt|pptx|mp4|webm|mp3|wav|ogg|css|js|json|xml|html|txt|csv|zip|rar|7z|tar|gz|webmanifest|map|md|yaml|yml)$'
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: 'docs-prod'
                }
              },
              {
                type: 'set_cache_policy',
                attributes: {
                  value: 'docs-prod'
                }
              },
              {
                type: 'deliver'
              }
            ]
          },
          {
            name: 'Redirect to index.html',
            description: 'Handle directory requests by rewriting to index.html',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '.*/$'
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: 'docs-prod'
                }
              },
              {
                type: 'rewrite_request',
                attributes: {
                  value: '${uri}index.html'
                }
              }
            ]
          },
          {
            name: 'Redirect to index.html for Subpaths',
            description: 'Handle subpath requests by rewriting to index.html',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '^(?!.*/$)(?![\\s\\S]*\\.[a-zA-Z0-9]+$).*'
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: 'docs-prod'
                }
              },
              {
                type: 'rewrite_request',
                attributes: {
                  value: '${uri}/index.html'
                }
              }
            ]
          }
        ],
        response: [
          {
            name: 'Serve llms.txt as UTF-8',
            description:
              'The storage connector sends text/plain without a charset, so browsers decode Portuguese text as Windows-1252',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '\\.txt$'
                },
                {
                  variable: '${status}',
                  conditional: 'and',
                  operator: 'is_equal',
                  argument: '200'
                }
              ]
            ],
            behaviors: [
              {
                type: 'filter_response_header',
                attributes: {
                  value: 'Content-Type'
                }
              },
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Content-Type: text/plain; charset=utf-8'
                }
              }
            ]
          },
          {
            name: 'Serve Markdown twins as UTF-8',
            description:
              'The storage connector sends text/markdown without a charset, so browsers decode Portuguese text as Windows-1252',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '\\.md$'
                },
                {
                  variable: '${status}',
                  conditional: 'and',
                  operator: 'is_equal',
                  argument: '200'
                }
              ]
            ],
            behaviors: [
              {
                type: 'filter_response_header',
                attributes: {
                  value: 'Content-Type'
                }
              },
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Content-Type: text/markdown; charset=utf-8'
                }
              }
            ]
          }
        ]
      }
    }
  ],
  workloads: [
    {
      name: 'docs-prod',
      active: true,
      infrastructure: 1,
      deployments: [
        {
          name: 'docs-prod',
          current: true,
          active: true,
          strategy: {
            type: 'default',
            attributes: {
              application: 'docs-prod'
            }
          }
        }
      ]
    }
  ]
}
