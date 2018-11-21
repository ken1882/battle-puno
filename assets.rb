#===================================================================
# Glob all images in assets/ and convert to js code in 'assets.js'
#===================================================================

files = Dir.glob('assets/*')
files.each do |file|
  puts sprintf("'#{file}',\n")
end