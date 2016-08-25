var json,
    minAge  = -1,
    maxAge  = -1,
    minLast = -1,
    maxLast = -1;

var readJSON = function(json) {
    var spaceName = document.getElementById('spaceName');
    if(spaceName !== null) spaceName.innerHTML = json.space.name;

    for(var i = 0, l = json.items.length; i < l; i++) {
        var age = new Date(json.items[i].created);
        age = age.getTime();
        age = (Date.now() - age) / 1000 / 60 / 60 / 24;

        var last = new Date(json.items[i].modified);
        last = last.getTime();
        last = (Date.now() - last) / 1000 / 60 / 60 / 24;

        if(minAge == -1) {
            minAge  = age;
            maxAge  = age;
            minLast = last;
            maxLast = last;
        } else {
            if(age < minAge) minAge = age;
            else if(age > maxAge) maxAge = age;
            if(last < minLast) minLast = last;
            else if(last > maxLast) maxLast = last;
        }
    }

    for(var i = 0, l = json.items.length; i < l; i++) {
        addItem(json.items[i]);
    }

    for(var i = 0, l = json.members.length; i < l; i++) {
        addMember(json.members[i]);
    }
}

var addItem = function(item) {
    if(item._type == "Alias") {
        gems.push(new Gem(new Vec2D(random(width), height - height / 24)));
    } else {
        var type, shape;
        switch(item._type) {
            case "Resource":
                type  = 0;
                shape = S_TRIANGLE;
                break;

            case "Application":
                type  = 1;
                shape = S_SQUARE;
                break;

            case "Topic":
                type  = 2;
                shape = S_HEXAGON;
                break;

            case "Space":
                type  = 3;
                shape = S_CIRCLE;
                break;
        }

        var age = 0;
        if(typeof item.created !== 'undefined') {
            age = new Date(item.created);
            age = age.getTime();
            age = (Date.now() - age) / 1000 / 60 / 60 / 24;
        }

        var last = 0;
        if(typeof item.modified !== 'undefined') {
            last = new Date(item.modified);
            last = last.getTime();
            last = (Date.now() - last) / 1000 / 60 / 60 / 24;
        }

        rocks.push(new Rock(new Vec2D(random(0, width), height - height/12),
                            constrain(map(age, minAge, maxAge, height/6, height/2), height/6, height/2),
                            constrain(map(last, minLast, maxLast, 0, PI/10), 0, PI/10) * (random() < .5 ? -1 : 1),
                            shape, shapes[type], item._id));
        rocks[rocks.length - 1].addAlgae();

        if(typeof item.comments !== 'undefined') {
            for(var i = 0, l = item.comments.length; i < l; i++) {
                addComment(item.comments[i], item._id);
            }
        }

        displayTree.push([]);
    }
}

var addComment = function(comment, itemId) {
    for(var i = 0; i < rocks.length; i++) {
        if(typeof itemId !== 'undefined' && rocks[i].id == itemId) {
            rocks[i].addBranch(comment._id);
            if(typeof comment.replies !== 'undefined') {
                for(var j = 0, l = comment.replies.length; j < l; j++) {
                    rocks[i].addBranch(comment.replies[j]._id, comment._id);
                }
            }
            return;
        } else if(rocks[i].id == comment.itemId) {
            rocks[i].addBranch(comment._id, comment.parentCommentId);
            return;
        }
    }
    console.log("The item with the id: " + itemId + " seems to not be here");
}

var addMember = function(member) {
    var index = constrain(map(member.metrics.contributor, 1, 7, 0, displayTree.length - 1), 0, displayTree.length - 1);
    index = Math.floor(index);

    var body = member.metrics.graasper == 7 ?
               fishBodies[fishBodies.length - 1] :
               fishBodies[constrain(member.metrics.graasper - 1, 0, 2)];

    var tail = member.metrics.graasper == 7 ?
               fishTails[fishTails.length - 1] :
               member.metrics.graasper > 3 ?
               fishTails[member.metrics.graasper - 3] :
               fishTails[0];

    fishes.push(new Fish(new Vec2D(width/2, -50), 3.0, 0.1, body, tail));
    displayTree[index].push(fishes[fishes.length - 1]);
}
