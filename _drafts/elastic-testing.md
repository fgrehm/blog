# Tire + ElasticSearch + tiny-rails

lets forget about vagrant for a while and talk about another gem that I wanted
to write about for a while

evaluated other options......

try out with my own rails-base-box



tiny-rails new tiny-elastic-sample -a activerecord coffeescript jquery


comes with a post model and a sqlite3 set up, from there you can:

 * edit your gemfile, add the tire gem, quiet_assets, kaminari
 * change the migrations.rb script to ...
 * change your models.rb to ...


tiny-rails console


```ruby
require 'models'

post = Post.create! title: 'An awesome post', body: "Some post that I'll write"
post.comments.create! body: 'First comment for the first post'
Post.create! title: 'A post with no comments', body: 'No one liked this one :('

# Just to ensure you are able to connect to elastic search
Post.search('post').count # should output 2
```


add tire-contrib https://github.com/karmi/tire-contrib/

edit initializers.rb

add require 'tire/rails/logger'




search = Tire.search do
  query { string 'post' }
  facet 'types' do
    terms :_type
  end
end

search.results.count



talk about testing, clearing the database, heroku + bonsai + indexes
