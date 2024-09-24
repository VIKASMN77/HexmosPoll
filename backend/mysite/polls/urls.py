
from django.urls import path
from . import views
from .views import create_poll, fetch_polls_by_tags, polls_controller, get_all_tags, poll_view

app_name = "polls"

urlpatterns = [
    path("", polls_controller, name="fetch_all_polls"),  #GET Fetch all polls 
    path("", create_poll, name="create_poll"), #POST Create poll
    path("", fetch_polls_by_tags, name="fetch_polls_by_tags"),  #Flter y tag
    path('tags/', get_all_tags, name='get_all_tags'),#GET List tags
    path("<int:id>/", poll_view, name="poll_view"),#GET Poll detail,#PUT Increment poll vote
]
