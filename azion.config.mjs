
export default {
  build: {
    preset: 'astro',
    polyfills: true
  },
  storage: [
    {
      name: 'docs-preview-webkit',
      prefix: '20260831143756',
      dir: './dist',
      workloadsAccess: 'read_only'
    }
  ],
  connectors: [
    {
      name: 'docs-preview-webkit',
      active: true,
      type: 'storage',
      attributes: {
        bucket: 'docs-preview-webkit',
        prefix: '20260831143756'
      }
    }
  ],
  applications: [
    {
      name: 'docs-preview-webkit',
      cache: [
        {
          name: 'docs-preview-webkit',
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
                    '\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|ttf|otf|woff|woff2|eot|pdf|doc|docx|xls|xlsx|ppt|pptx|mp4|webm|mp3|wav|ogg|css|js|json|xml|html|txt|csv|zip|rar|7z|tar|gz|webmanifest|map|md|yaml|yml)$'
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: 'docs-preview-webkit'
                }
              },
              {
                type: 'set_cache_policy',
                attributes: {
                  value: 'docs-preview-webkit'
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
                  value: 'docs-preview-webkit'
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
                  argument: '^(?!.*\/$)(?![\s\S]*\.[a-zA-Z0-9]+$).*'
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: 'docs-preview-webkit'
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
        response: []
      }
    }
  ],
  workloads: [
    {
      name: 'docs-preview-webkit',
      active: true,
      infrastructure: 1,
      deployments: [
        {
          name: 'docs-preview-webkit',
          current: true,
          active: true,
          strategy: {
            type: 'default',
            attributes: {
              application: 'docs-preview-webkit'
            }
          }
        }
      ]
    }
  ]
}
