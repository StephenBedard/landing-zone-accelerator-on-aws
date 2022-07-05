/**
 *  Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as cdk from 'aws-cdk-lib';
import { DetectiveGraphConfig } from '../../lib/aws-detective/detective-graph-config';

const testNamePrefix = 'Construct(DetectiveGraphConfig): ';

//Initialize stack for snapshot test and resource configuration test
const stack = new cdk.Stack();

new DetectiveGraphConfig(stack, 'DetectiveGraphConfig', {
  kmsKey: new cdk.aws_kms.Key(stack, 'CustomKey', {}),
  logRetentionInDays: 3653,
});

/**
 * DetectiveGraphConfig construct test
 */
describe('DetectiveGraphConfig', () => {
  /**
   * Number of IAM role resource test
   */
  test(`${testNamePrefix} IAM role resource count test`, () => {
    cdk.assertions.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
  });

  /**
   * Number of Lambda function resource test
   */
  test(`${testNamePrefix} Lambda function resource count test`, () => {
    cdk.assertions.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);
  });

  /**
   * Number of DetectiveUpdateGraph custom resource test
   */
  test(`${testNamePrefix} DetectiveUpdateGraph custom resource count test`, () => {
    cdk.assertions.Template.fromStack(stack).resourceCountIs('Custom::DetectiveUpdateGraph', 1);
  });

  /**
   * Lambda Function resource configuration test
   */
  test(`${testNamePrefix} Lambda Function resource configuration test`, () => {
    cdk.assertions.Template.fromStack(stack).templateMatches({
      Resources: {
        CustomDetectiveUpdateGraphCustomResourceProviderHandlerD4473EC1: {
          Type: 'AWS::Lambda::Function',
          DependsOn: ['CustomDetectiveUpdateGraphCustomResourceProviderRole54CD7295'],
          Properties: {
            Code: {
              S3Bucket: {
                'Fn::Sub': 'cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}',
              },
            },
            Handler: '__entrypoint__.handler',
            MemorySize: 128,
            Role: {
              'Fn::GetAtt': ['CustomDetectiveUpdateGraphCustomResourceProviderRole54CD7295', 'Arn'],
            },
            Runtime: 'nodejs14.x',
            Timeout: 900,
          },
        },
      },
    });
  });

  /**
   * IAM role resource configuration test
   */
  test(`${testNamePrefix} IAM role resource configuration test`, () => {
    cdk.assertions.Template.fromStack(stack).templateMatches({
      Resources: {
        CustomDetectiveUpdateGraphCustomResourceProviderRole54CD7295: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'lambda.amazonaws.com',
                  },
                },
              ],
              Version: '2012-10-17',
            },
            ManagedPolicyArns: [
              {
                'Fn::Sub': 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
              },
            ],
            "Policies": [
              {
                "PolicyDocument": {
                  "Statement": [
                    {
                      "Action": [
                        "organizations:DeregisterDelegatedAdministrator",
                        "organizations:DescribeOrganization",
                        "organizations:EnableAWSServiceAccess",
                        "organizations:ListAWSServiceAccessForOrganization",
                        "organizations:ListAccounts",
                        "organizations:ListDelegatedAdministrators",
                        "organizations:RegisterDelegatedAdministrator",
                        "organizations:ServicePrincipal",
                        "organizations:UpdateOrganizationConfiguration",
                      ],
                      "Condition": {
                        "StringLikeIfExists": {
                          "organizations:DeregisterDelegatedAdministrator": [
                            "detective.amazonaws.com",
                          ],
                          "organizations:DescribeOrganization": [
                            "detective.amazonaws.com",
                          ],
                          "organizations:EnableAWSServiceAccess": [
                            "detective.amazonaws.com",
                          ],
                          "organizations:ListAWSServiceAccessForOrganization": [
                            "detective.amazonaws.com",
                          ],
                          "organizations:ListAccounts": [
                            "detective.amazonaws.com",
                          ],
                          "organizations:ListDelegatedAdministrators": [
                            "detective.amazonaws.com",
                          ],
                          "organizations:RegisterDelegatedAdministrator": [
                            "detective.amazonaws.com",
                          ],
                          "organizations:ServicePrincipal": [
                            "detective.amazonaws.com",
                          ],
                          "organizations:UpdateOrganizationConfiguration": [
                            "detective.amazonaws.com",
                          ],
                        },
                      },
                      "Effect": "Allow",
                      "Resource": "*",
                      "Sid": "DetectiveConfigureOrganizationAdminAccountTaskOrganizationActions",
                    },
                    {
                      "Action": [
                        "detective:UpdateOrganizationConfiguration",
                        "detective:ListGraphs",
                        "detective:ListMembers",
                      ],
                      "Effect": "Allow",
                      "Resource": "*",
                      "Sid": "DetectiveUpdateGraphTaskDetectiveActions",
                    },
                  ],
                  "Version": "2012-10-17",
                },
                "PolicyName": "Inline",
              },
            ],
          },
        },
      },
    });
  });

  /**
   * DetectiveUpdateGraph custom resource configuration test
   */
  test(`${testNamePrefix} DetectiveUpdateGraph custom resource configuration test`, () => {
    cdk.assertions.Template.fromStack(stack).templateMatches({
      Resources: {
        DetectiveGraphConfig248C4B9F: {
          Type: 'Custom::DetectiveUpdateGraph',
          DeletionPolicy: 'Delete',
          UpdateReplacePolicy: 'Delete',
          Properties: {
            ServiceToken: {
              'Fn::GetAtt': ['CustomDetectiveUpdateGraphCustomResourceProviderHandlerD4473EC1', 'Arn'],
            },
            region: {
              Ref: 'AWS::Region',
            },
          },
        },
      },
    });
  });
});
