import '@aws-cdk/assert/jest';
import { App } from '@aws-cdk/core';
import { EthrwarsStack } from '../src/main';

test('Snapshot', () => {
  const app = new App();
  const stack = new EthrwarsStack(app, 'test', {functions: []});

  expect(stack).not.toHaveResource('AWS::S3::Bucket');
  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
});