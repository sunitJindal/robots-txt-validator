# robots-txt-validator
Validator to verify robots.txt and sitemaps listed in it

## How to use
Install globaly
```
yarn global add robots-txt-validator
```
Execute command
```
robots-validator <sitename.com>
```
- No need to add robots.txt while specifying domain name
- Example of proper `sitename`
  - http://www.example.com
  - http://example.com
  - https://www.example.com
  - https://example.com

## Debug mode
The validator support ways to see being executed. There are multiple debug modes that you can choose:
1. `error` display error message that occured during processing
2. `log` general log message
3. `sitemapIndex` information about fetching/parsing operation on sitemap index
4. `urlset` information about parsing operation on a urlset sitemap

### Using Debug mode
Below are some sample commands
```
DEBUG=error,sitemapIndex,urlset,log robots-validator https://example.com
```
Install globaly
```
yarn global add robots-txt-validator
```
Execute command
```
robots-validator <sitename.com>
```
