/**
 * Azion configuration for the redirects edge function — **v4 account**.
 *
 * v4 schema (`applications`/`workloads`). The request rule runs the function for
 * every request; the function itself decides redirect (301/302) vs. passthrough
 * to origin.
 *
 * Bootstrap state: nothing is deployed yet. azion/azion.json carries ids 0, and the
 * first manual deploy creates the resources and records their ids there.
 * See: https://github.com/aziontech/lib/tree/main/packages/config
 */
import { defineConfig } from 'azion'

export default defineConfig({
  build: {
    entry: ['src/index.ts'],
    preset: 'typescript',
    polyfills: true
  },
  functions: [
    {
      name: 'docs-redirects',
      path: './functions/index.js'
    }
  ],
  applications: [
    {
      name: 'docs-redirects',
      rules: {
        request: [
          {
            name: 'Redirects',
            description:
              'Run the redirect function for every request; it serves a 301/302 for known sources and passes everything else through to origin via an O(1) lookup',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '^/'
                }
              ]
            ],
            behaviors: [
              {
                type: 'run_function',
                attributes: {
                  value: 'docs-redirects'
                }
              }
            ]
          }
        ]
      },
      functionsInstances: [
        {
          name: 'docs-redirects',
          ref: 'docs-redirects'
        }
      ]
    }
  ],
  workloads: [
    {
      name: 'docs-redirects',
      active: true,
      infrastructure: 1,
      deployments: [
        {
          name: 'docs-redirects',
          current: true,
          active: true,
          strategy: {
            type: 'default',
            attributes: {
              application: 'docs-redirects'
            }
          }
        }
      ]
    }
  ]
})
