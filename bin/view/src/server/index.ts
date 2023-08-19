import { pzrequest } from "./requestPackage";

export async function getNpmAnalyzeRequest() {
  return await pzrequest.get({
    url: '/npmAnalyze'
  })
}