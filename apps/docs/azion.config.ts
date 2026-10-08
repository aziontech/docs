import process from 'node:process'

const environments = {
  production: { name: 'docs-prod', bucket: 'prod-docs', prefix: '20261005193619' },
  stage: { name: 'docs-stage', bucket: 'stage-docs', prefix: '20261006140609' }
} as const

const env = process.env.AZION_ENV
if (env !== 'production' && env !== 'stage') {
  throw new Error(`AZION_ENV must be "production" or "stage", got "${env ?? ''}"`)
}
const { name, bucket, prefix } = environments[env]

export default {
  build: {
    preset: 'astro',
    polyfills: true
  },
  storage: [
    {
      name: bucket,
      prefix,
      dir: './dist',
      workloadsAccess: 'read_only'
    }
  ],
  connectors: [
    {
      name,
      active: true,
      type: 'storage',
      attributes: {
        bucket,
        prefix
      }
    }
  ],
  applications: [
    {
      name,
      imageProcessorEnabled: true,
      cache: [],
      rules: {
        request: [
          {
            name: 'default rules',
            description: 'Apply default rules for all requests',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'exists'
                }
              ]
            ],
            behaviors: [
              {
                type: 'redirect_http_to_https'
              },
              {
                type: 'enable_gzip'
              }
            ]
          },
          {
            name: 'default set connector',
            description: 'apply default set connector for all requests',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'exists'
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: name
                }
              }
            ]
          },
          {
            name: 'set cookie pt-br',
            description: 'set azion_lang=PT cookie for ${geoip_country_code} matches (BR|PT)',
            active: true,
            criteria: [
              [
                {
                  variable: '${geoip_country_code}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '(BR|PT)'
                }
              ]
            ],
            behaviors: [
              {
                type: 'add_request_cookie',
                attributes: {
                  value: 'azion_lang=PT'
                }
              }
            ]
          },
          {
            name: 'set cookie en',
            description:
              'set azion_lang=EN cookie for ${geoip_country_code} does not matches (BR|PT|AR|BO|CL|CO|EC|FK|PY|PE|UY|VE|CR|CU|DO|SV|GT|HN|MX|NI|PA|ES)',
            active: true,
            criteria: [
              [
                {
                  variable: '${geoip_country_code}',
                  conditional: 'if',
                  operator: 'does_not_match',
                  argument: '(BR|PT|AR|BO|CL|CO|EC|FK|PY|PE|UY|VE|CR|CU|DO|SV|GT|HN|MX|NI|PA|ES)'
                }
              ]
            ],
            behaviors: [
              {
                type: 'add_request_cookie',
                attributes: {
                  value: 'azion_lang=EN'
                }
              }
            ]
          },
          {
            name: '301 en',
            description: '${cookie_azion_lang} is equal EN redirect to /en/documentation/',
            active: true,
            criteria: [
              [
                {
                  variable: '${cookie_azion_lang}',
                  conditional: 'if',
                  operator: 'is_equal',
                  argument: 'EN'
                },
                {
                  variable: '${uri}',
                  conditional: 'and',
                  operator: 'is_equal',
                  argument: '/'
                }
              ]
            ],
            behaviors: [
              {
                type: 'redirect_to_301',
                attributes: {
                  value: '/en/documentation/'
                }
              }
            ]
          },
          {
            name: '301 pt-br',
            description: '${cookie_azion_lang} is equal PT redirect to /pt-br/documentacao/',
            active: true,
            criteria: [
              [
                {
                  variable: '${cookie_azion_lang}',
                  conditional: 'if',
                  operator: 'is_equal',
                  argument: 'PT'
                },
                {
                  variable: '${uri}',
                  conditional: 'and',
                  operator: 'is_equal',
                  argument: '/'
                }
              ]
            ],
            behaviors: [
              {
                type: 'redirect_to_301',
                attributes: {
                  value: '/pt-br/documentacao/'
                }
              }
            ]
          },
          {
            name: 'rewrite to index',
            description: 'rewrite to ${uri}/index.html',
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
                type: 'rewrite_request',
                attributes: {
                  value: '${uri}index.html'
                }
              }
            ]
          },
          {
            name: 'image optimization',
            description: 'rewrite to ${uri}/index.html',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '\\.(jpg|jpeg|gif|png|bmp)$'
                }
              ]
            ],
            behaviors: [
              {
                type: 'optimize_images'
              }
            ]
          }
        ],
        response: [
          {
            name: 'gzip',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'exists'
                }
              ]
            ],
            behaviors: [
              {
                type: 'enable_gzip'
              }
            ]
          },
          {
            name: 'security headers',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'exists'
                }
              ]
            ],
            behaviors: [
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'
                }
              },
              {
                type: 'add_response_header',
                attributes: {
                  value: 'X-Frame-Options: SAMEORIGIN'
                }
              },
              {
                type: 'add_response_header',
                attributes: {
                  value: 'X-XSS-Protection: 1; mode=block'
                }
              },
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Referrer-Policy: no-referrer'
                }
              },
              {
                type: 'add_response_header',
                attributes: {
                  value: 'X-Content-Type-Options: nosniff'
                }
              },
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Permissions-Policy: geolocation=(), camera=(), microphone=()'
                }
              }
            ]
          },
          {
            name: 'Access-Control-Allow-Origin cors',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'exists'
                }
              ]
            ],
            behaviors: [
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Access-Control-Allow-Origin: *'
                }
              }
            ]
          },
          {
            name: 'Content-Language pt-br',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'starts_with',
                  argument: '/pt-br/'
                }
              ]
            ],
            behaviors: [
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Content-Language: pt, pt-BR'
                }
              }
            ]
          },
          {
            name: 'Content-Language en',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'starts_with',
                  argument: '/en/'
                }
              ]
            ],
            behaviors: [
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Content-Language: en'
                }
              }
            ]
          },
          {
            name: 'Content-Type html',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '\\.html$'
                }
              ]
            ],
            behaviors: [
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Content-Type: text/html; charset=utf-8'
                }
              }
            ]
          },
          {
            name: 'Content-Type txt',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '\\.txt$'
                }
              ]
            ],
            behaviors: [
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Content-Type: text/plain; charset=UTF-8'
                }
              }
            ]
          },
          {
            name: 'Content-Type md',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '\\.md$'
                }
              ]
            ],
            behaviors: [
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Content-Type: text/markdown; charset=UTF-8'
                }
              }
            ]
          },
          {
            name: 'Content-Type xml',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '\\.xml$'
                }
              ]
            ],
            behaviors: [
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Content-Type: application/xml;'
                }
              }
            ]
          },
          {
            name: 'debug header',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'exists'
                }
              ]
            ],
            behaviors: [
              {
                type: 'add_response_header',
                attributes: {
                  value: 'x-azion-debug: 06'
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
      name,
      active: true,
      infrastructure: 1,
      deployments: [
        {
          name,
          current: true,
          active: true,
          strategy: {
            type: 'default',
            attributes: {
              application: name
            }
          }
        }
      ]
    }
  ]
}
